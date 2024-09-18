import {
  FunctionDeclaration as IFunctionDeclaration,
  Identifier,
} from "@babel/types";
import { Parser } from "./parser";

export const FunctionDeclaration: Parser<IFunctionDeclaration> = {
  getIdentifier(node: IFunctionDeclaration): Identifier {
    return node.id;
  },

  isConstant(node: IFunctionDeclaration): boolean {
    return false;
  },

  isComponent(node: IFunctionDeclaration): boolean {
    throw new Error("FunctionDeclaration.isComponent not implemented");
  },

  isTypescript(node: IFunctionDeclaration): boolean {
    return false;
  },
};
