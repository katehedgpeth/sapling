import { AST_NODE_TYPES } from "@typescript-eslint/types";
import * as Types from "@babel/types";
import Path from "path";

import { getNonce } from "./getNonce";
import Dependencies from "./Dependencies";
import { Import } from "./Import";
import { AST } from "./AST";
import { Parser } from "./parsers/parser";
import {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  ImportDefaultSpecifier,
  TSInterfaceDeclaration,
  VariableDeclaration,
} from "./parsers";

export type SourceAst =
  | Types.ArrowFunctionExpression
  | Types.ExportNamedDeclaration
  | Types.ExportDefaultDeclaration
  | Types.ExportAllDeclaration
  | Types.VariableDeclaration
  | Types.ImportDeclaration
  | Types.ImportDefaultSpecifier
  | Types.FunctionDeclaration
  | Types.TSInterfaceDeclaration;
// type SourceAst = Omit<Statement, "ImportDeclaration">;

interface Props<T> {
  ast: T;
  filePath: string;
  srcPath: string;
  parent?: AST;
}

export class Node<T extends SourceAst = SourceAst> {
  public id: string;
  public filePath: string;
  public srcPath: string;
  public fileName: string;
  public name: string;
  public ast: T;
  public is: {
    export: boolean;
    import: boolean;
    component: boolean;
    dependency: boolean;
    type: boolean;
    function: boolean;
    constant: boolean;
  };

  constructor({ ast, filePath, srcPath, parent }: Props<T>) {
    this.id = getNonce();
    this.ast = ast;
    this.name = Node.getIdentifier(this).name;
    this.fileName = Path.basename(filePath);
    this.filePath = filePath;
    this.srcPath = srcPath;
    this.is = {
      export: Node.isExport(this),
      import: Node.isImport(this),
      dependency: Node.isDependency(this),
      component: false,
      // component: Node.isComponent(this, parent),
      type: Node.isTypescript(this),
      function: Node.isFunction(this),
      constant: Node.isConstant(this),
    };
    // this.importPath = "/"; // this.entryFile here breaks windows file path on root e.g. C:\\ is detected as third part
    // this.expanded = false;
    // this.depth = 0;
    // this.count = 1;
    // this.thirdParty = false;
    // this.reactRouter = false;
    // this.children = [] as Node["id"][];
    // this.parentList = [];
    // this.props = {};
  }

  static isExport(
    node: Node<SourceAst>
  ): node is Node<
    Types.ExportNamedDeclaration | Types.ExportDefaultDeclaration
  > {
    return (
      node.ast.type === AST_NODE_TYPES.ExportNamedDeclaration ||
      node.ast.type === AST_NODE_TYPES.ExportDefaultDeclaration
    );
  }

  static isExportAll(
    node: Node<SourceAst>
  ): node is Node<Types.ExportAllDeclaration> {
    return node.ast.type === AST_NODE_TYPES.ExportAllDeclaration;
  }

  static isImport(
    node: Node<SourceAst>
  ): node is Node<Types.ImportDeclaration> {
    return node.ast.type === AST_NODE_TYPES.ImportDeclaration;
  }

  private static getParser(node: Node<SourceAst> | Import): Parser<SourceAst> {
    switch (node.ast.type) {
      case AST_NODE_TYPES.ExportNamedDeclaration:
        return ExportNamedDeclaration;

      case AST_NODE_TYPES.ExportDefaultDeclaration:
        return ExportDefaultDeclaration;

      case AST_NODE_TYPES.VariableDeclaration:
        return VariableDeclaration;

      case AST_NODE_TYPES.FunctionDeclaration:
        return FunctionDeclaration;

      case AST_NODE_TYPES.TSInterfaceDeclaration:
        return TSInterfaceDeclaration;

      case AST_NODE_TYPES.ImportDefaultSpecifier:
        return ImportDefaultSpecifier;

      default:
        throw new Error("Unexpected node type: " + node.ast.type);
    }
  }

  static isConstant<T extends SourceAst>(node: Node<T>): boolean {
    return Node.getParser(node).isConstant(node.ast);
    // switch (node.ast.type) {
    //   case AST_NODE_TYPES.VariableDeclaration:
    //     return Parsers.VariableDeclaration.isConstant(node.ast);

    //   case AST_NODE_TYPES.ExportNamedDeclaration:
    //     return Parsers.ExportNamedDeclaration.isConstant(node.ast);

    //   case AST_NODE_TYPES.TSInterfaceDeclaration:
    //     return
    //   default:
    //     throw new Error("Unexpected node type: " + node.ast.type);
    // }
  }

  static isDependency(
    node: Node<SourceAst>
  ): node is Node<Types.ImportDeclaration> {
    if (!Node.isImport(node)) {
      return false;
    }
    const value = node.ast.source.value;
    const isDependency = Dependencies.isDependency(node.srcPath, value);
    return isDependency;
  }

  static isComponent<T extends SourceAst>(node: Node<T>, parent: AST): boolean {
    if (Node.isImport(node)) {
      return false;
    }
    return Node.getParser(node).isComponent(node.ast, parent);
  }

  static isHOC() {}

  static isDefaultExportComponent(node: ExportDefaultNode): boolean {
    return false;
    // switch (node.ast.declaration.type) {
    //   case AST_NODE_TYPES.CallExpression:
    // }
  }

  static getIdentifier<T extends SourceAst>(
    node: Node<T>
  ): Types.Identifier | undefined {
    return Node.getParser(node).getIdentifier(node.ast);
  }

  // static isVariable(node: Node): boolean {
  //   return Node.getType(node) === AST_NODE_TYPES.VariableDeclaration;
  // }

  static isFunction<T extends SourceAst>(node: Node<T>): boolean {
    return Node.getType(node) === AST_NODE_TYPES.FunctionDeclaration;
  }

  static isTypescript<T extends SourceAst>(node: Node<T>): boolean {
    switch (node.ast.type) {
      case AST_NODE_TYPES.TSInterfaceDeclaration:
        return true;

      case AST_NODE_TYPES.VariableDeclaration:
      case AST_NODE_TYPES.ArrowFunctionExpression:
        return false;

      case AST_NODE_TYPES.ExportNamedDeclaration:
        return ExportNamedDeclaration.isTypescript(node.ast);

      default:
        throw new Error("Unexpected node type: " + node.ast.type);
    }
  }

  static getType<T extends SourceAst>(node: Node<T>): AST_NODE_TYPES {
    return (
      Node.isExport(node) ? node.ast.declaration.type : node.ast.type
    ) as AST_NODE_TYPES;
  }
}

interface ExportNode
  extends Node<Types.ExportDefaultDeclaration | Types.ExportNamedDeclaration> {
  ast: Types.ExportDefaultDeclaration | Types.ExportNamedDeclaration;
}

interface ExportAllNode extends Node<Types.ExportAllDeclaration> {}

interface ExportDefaultNode extends Node<Types.ExportDefaultDeclaration> {
  ast: Types.ExportDefaultDeclaration;
}

interface ImportNode extends Node<Types.ImportDeclaration> {
  ast: Types.ImportDeclaration;
}
