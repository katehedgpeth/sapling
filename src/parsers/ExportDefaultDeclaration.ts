import {
  ExportDefaultDeclaration as IExportDefaultDeclaration,
  Identifier,
} from "@babel/types";
import { Parser } from "./parser";

export const ExportDefaultDeclaration: Parser<IExportDefaultDeclaration> = {
  getIdentifier(node): Identifier {
    return {
      type: "Identifier",
      name: "default",
    };
  },
  isComponent(node, file): boolean {
    throw new Error("ExportDefaultDeclaration.isComponent not implemented");
  },

  isConstant(node): boolean {
    throw new Error("ExportDefaultDeclaration.isConstant not implemented");
  },

  isTypescript(node): boolean {
    throw new Error("ExportDefaultDeclaration.isTypescript not implemented");
  },
};
