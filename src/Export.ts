import {
  ExportDeclaration,
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
} from "@babel/types";
import { getNonce } from "./getNonce";
import { TSDeclaration } from "./types";

export enum ExportType {
  Component,
  Constant,
  Function,
  Type,
}

type Node = TSDeclaration;
enum ExportMethod {
  Default = "ExportDefaultDeclaration",
  Named = "ExportNamedDeclaration",
  All = "ExportAllDeclaration",
}

export type Props = {
  node: Node;
  filePath: string;
  srcPath: string;
  exportMethod:
    | ExportDefaultDeclaration["type"]
    | ExportNamedDeclaration["type"]
    | ExportAllDeclaration["type"];
};

export class Export<NodeType extends Node> {
  public id: string;
  public exportMethod: ExportMethod;
  private srcPath: string;
  private filePath: string;
  public node: Node;

  constructor({ srcPath, exportMethod, node, filePath }: Props) {
    this.id = getNonce();
    this.srcPath = srcPath;
    this.filePath = filePath;
    this.node = node;
    this.parseExportMethod(exportMethod);
  }

  parseExportMethod(exportMethod: Props["exportMethod"]) {
    const [key] = Object.entries(ExportMethod).find(([_key, value]) => {
      // @ts-ignore
      return value === exportMethod;
    });

    this.exportMethod = ExportMethod[key];
  }

  // public get node(): Node {
  //   return this._node;
  // }

  static parseType(node: ExportDeclaration): ExportType {
    if (node) {
      return ExportType.Type;
    }
  }
}
