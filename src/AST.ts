// import { parse } from "@typescript-eslint/parser";
// import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { parse, ParseResult } from "@babel/parser";
import {
  Statement,
  File,
  Identifier,
  ImportDeclaration,
  IfStatement,
  // ExportDeclaration,
  // ExportDefaultDeclaration,
  // ExportNamedDeclaration,
} from "@babel/types";
import FS from "fs";
import Path from "path";
import { Type } from "./exports/Type";
import { TSDeclaration } from "./types";
import { Node, SourceAst } from "./Node";
import { Import } from "./Import";
import Dependencies from "./Dependencies";

type Result = ParseResult<File>;
type Program = Result["program"];
type Parsed = Omit<Result, "program"> & { program: Omit<Program, "body"> };

type ASTNode = Result["program"]["body"][number];

export class AST {
  public nodes: Map<string, Node | Import> = new Map();

  // imports
  public localImports: string[] = [];
  public dependencies: string[] = [];

  // exports
  public exports: string[] = [];
  public imports: string[] = [];
  public types: string[] = [];
  public constants: string[] = [];
  public functions: string[] = [];
  public components: string[] = [];

  // private
  public parsed: Parsed;
  private path: string;
  private srcPath: string;

  constructor(path: string, srcPath: string) {
    this.path = path;
    this.srcPath = srcPath;
    this.parse();
  }

  static readFile(path: string): string {
    const resolved = Path.resolve(path);
    return FS.readFileSync(resolved, "utf-8");
  }

  static getNodeByIdentifier(ast: AST, identifier: Identifier): Node | Import {
    const node = ast.nodes.get(identifier.name);
    if (!node) {
      throw new Error(`Node not found: ${identifier.name}`);
    }
    return node;
  }

  private parse(): AST {
    let result: Result;
    try {
      result = parse(AST.readFile(this.path), {
        sourceType: "module",
        tokens: true,
        plugins: ["jsx", "typescript"],
      });
    } catch (e) {
      // @ts-ignore
      throw new Error(`Failed to parse file: ${this.path}`, { cause: e });
    }

    // writeAst(result, this.path);

    const { program, ...parsed } = result;
    const { body, ...rest } = program;

    this.nodes = body.reduce((acc, node) => {
      try {
        return this.parseNode(acc, node);
      } catch (error) {
        // @ts-ignore
        console.error("Failed to parse node", { node, error });
        return acc;
      }
    }, new Map());
    this.parsed = { ...parsed, program: rest };

    return this;
  }

  private parseNode(
    acc: Map<string, Node>,
    node: Statement
  ): Map<string, Node> {
    if (node.type === "ImportDeclaration") {
      this.parseImport(node, acc);
      return acc;
    }
    if (node.type === "IfStatement") {
      this.parseIfStatement(node, acc);
      return acc;
    }

    if (node.type === "ExpressionStatement") {
      this.parseExpressionStatement(node, acc);
    }
    const parsed = new Node({
      ast: node as SourceAst,
      filePath: this.path,
      srcPath: this.srcPath,
      parent: this,
    });

    parsed.is.component = Node.isComponent(parsed, this);

    if (parsed.is.export) {
      this.exports.push(parsed.id);
    }
    acc.set(parsed.name, parsed);

    return acc;
  }

  private parseImport(node: ImportDeclaration, acc: Map<string, Node>) {
    node.specifiers.forEach((specifier) => {
      const imp = new Import({
        specifier,
        srcPath: this.srcPath,
        importedTo: this.path,
        importedFrom: node.source.value,
      });

      this.nodes.set(imp.name, imp);
      this.imports.push(imp.name);

      if (imp.is.dependency) {
        this.dependencies.push(imp.name);
      } else {
        this.localImports.push(imp.name);
      }
    });
  }
  private parseIfStatement(_node: IfStatement, acc: Map<string, Node>) {
    return acc;
  }

  private parseExpressionStatement(_node: Statement, acc: Map<string, Node>) {
    return acc;
  }
}

const writeAst = (ast: Result, path: string) => {
  const name = Path.basename(path);
  const writePath = Path.join(__dirname, "test", "mocks", `${name}.json`);
  if (FS.existsSync(writePath)) {
    return;
  }
  FS.writeFileSync(writePath, JSON.stringify(ast));
};
