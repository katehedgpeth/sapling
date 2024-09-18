import {
  TSInterfaceDeclaration as ITSInterfaceDeclaration,
  Identifier,
} from "@babel/types";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import * as Parsers from ".";
import { Parser } from "./parser";

export const TSInterfaceDeclaration: Parser<ITSInterfaceDeclaration> = {
  getIdentifier(node) {
    return node.id;
  },

  isComponent(node) {
    return false;
  },
  isConstant(node) {
    return false;
  },
  isTypescript(node) {
    return true;
  },
};
