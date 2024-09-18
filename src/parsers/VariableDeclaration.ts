import {
  VariableDeclaration as IVariableDeclaration,
  Identifier,
} from "@babel/types";
import { VariableDeclarator } from "./VariableDeclarator";
import { Parser } from "./parser";

export const VariableDeclaration: Parser<IVariableDeclaration> = {
  getIdentifier(node) {
    if (node.declarations.length > 1) {
      throw new Error("VariableDeclaration has multiple declarators!");
    }
    return VariableDeclarator.getIdentifier(node.declarations[0]);
  },

  isComponent(node, file) {
    return VariableDeclarator.isComponent(node.declarations[0], file);
  },

  isConstant(node) {
    switch (node.kind) {
      case "const":
        return VariableDeclarator.isConstant(node.declarations[0]);
    }
  },

  isTypescript(node) {
    return false;
  },
};

const isSingleDeclarator = (node: IVariableDeclaration): void | never => {
  if (node.declarations.length > 1) {
    throw new Error("VariableDeclaration has multiple declarators!");
  }
};
