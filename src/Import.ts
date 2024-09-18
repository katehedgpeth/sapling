import {
  ImportSpecifier as IImportSpecifier,
  ImportDefaultSpecifier as IImportDefaultSpecifier,
  ImportNamespaceSpecifier as IImportNamespaceSpecifier,
} from "@babel/types";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import Path from "path";
import FS from "fs";
import Dependencies from "./Dependencies";
import { ImportSpecifier } from "./parsers/ImportSpecifier";
import { ImportDefaultSpecifier } from "./parsers/ImportDefaultSpecifier";
import { getNonce } from "./getNonce";

type Specifier =
  | IImportSpecifier
  | IImportDefaultSpecifier
  | IImportNamespaceSpecifier;

interface Props {
  specifier: Specifier;
  srcPath: string;
  importedTo: string;
  importedFrom: string;
}

export class Import {
  public id: string;
  public name: string;
  public importedTo: string;
  public importedFrom: string;
  public srcPath: string;
  public ast: Specifier;
  public is: {
    default: boolean;
    dependency: boolean;
  };

  constructor({ specifier, srcPath, importedTo, importedFrom }: Props) {
    this.id = getNonce();
    this.importedTo = importedTo;
    this.importedFrom = importedFrom;
    this.srcPath = srcPath;
    this.ast = specifier;
    this.is = {
      default: specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier,
      dependency: Dependencies.isDependency(srcPath, importedFrom),
    };
    this.name = Import.parseName(this);
    // this.exportPath = Import.parseExportFilePath(declaration, srcPath);
  }

  static parseName({ ast }: Import): string {
    switch (ast.type) {
      case AST_NODE_TYPES.ImportSpecifier:
        return ImportSpecifier.name(ast);
      case AST_NODE_TYPES.ImportDefaultSpecifier:
        return ImportDefaultSpecifier.name(ast);
      case AST_NODE_TYPES.ImportNamespaceSpecifier:
        return "*";
      default:
        // @ts-expect-error Error is not up to date
        throw new Error("Unexpected specifier type", { cause: ast });
    }
    // if (ast.type === "ImportDefaultSpecifier") {
    //   return "default";
    // }
    // return ImportSpecifier.name(ast);
    // throw new Error("Unexpected specifier type", { cause: ast });
    // return ast.loc.identifierName;
  }
}
