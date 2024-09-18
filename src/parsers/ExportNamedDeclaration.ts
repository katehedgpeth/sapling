import { ExportNamedDeclaration as IExportNamedDeclaration } from "@babel/types";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { VariableDeclaration } from "./VariableDeclaration";
import { FunctionDeclaration } from "./FunctionDeclaration";
import { Parser } from "./parser";

export const ExportNamedDeclaration: Parser<IExportNamedDeclaration> = {
  getIdentifier(node) {
    switch (node.declaration.type) {
      case AST_NODE_TYPES.FunctionDeclaration:
        return FunctionDeclaration.getIdentifier(node.declaration);

      case AST_NODE_TYPES.VariableDeclaration:
        return VariableDeclaration.getIdentifier(node.declaration);

      default:
        throw new Error(
          "Unexpected declaration type for ExportNamedDeclaration: " +
            node.declaration.type
        );
    }
  },

  isComponent(node, ast) {
    switch (node.declaration.type) {
      case AST_NODE_TYPES.VariableDeclaration:
        return VariableDeclaration.isComponent(node.declaration, ast);

      case AST_NODE_TYPES.TSInterfaceDeclaration:
        return false;

      default:
        throw new Error(
          "Unexpected declaration type for ExportNamedDeclaration: " +
            node.declaration.type
        );
    }
  },

  isConstant(node) {
    switch (node.declaration.type) {
      case AST_NODE_TYPES.VariableDeclaration:
        return VariableDeclaration.isConstant(node.declaration);

      case AST_NODE_TYPES.TSInterfaceDeclaration:
        return false;

      default:
        throw new Error(
          "Unexpected declaration type for ExportNamedDeclaration: " +
            node.declaration.type
        );
    }
  },

  isTypescript(node) {
    switch (node.declaration.type) {
      case AST_NODE_TYPES.TSInterfaceDeclaration:
        return true;

      case AST_NODE_TYPES.VariableDeclaration:
        return false;

      default:
        throw new Error(
          "Unexpected declaration type for ExportNamedDeclaration: " +
            node.declaration.type
        );
    }
  },
};
