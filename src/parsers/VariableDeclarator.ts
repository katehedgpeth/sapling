import {
  VariableDeclarator as IVariableDeclarator,
  Identifier,
} from "@babel/types";

import { AST_NODE_TYPES } from "@typescript-eslint/types";

import { ArrowFunctionExpression } from "./ArrowFunctionExpression";
import { CallExpression } from "./CallExpression";
import { Parser } from "./parser";

export const VariableDeclarator: Parser<IVariableDeclarator> = {
  getIdentifier(node) {
    switch (node.id.type) {
      case AST_NODE_TYPES.Identifier:
        return node.id;

      default:
        throw new Error(
          "Unexpected id type for VariableDeclarator: " + node.id.type
        );
    }
  },

  isComponent(node, file) {
    switch (node.init.type) {
      case AST_NODE_TYPES.ArrowFunctionExpression:
        return ArrowFunctionExpression.isComponent(node.init, file);

      case AST_NODE_TYPES.CallExpression:
        return CallExpression.isComponent(node.init, file);

      default:
        throw new Error(
          "Unexpected init type for VariableDeclarator: " + node.init.type
        );
    }
  },
  isConstant(node) {
    switch (node.init.type) {
      case AST_NODE_TYPES.ArrowFunctionExpression:
        return false;

      case AST_NODE_TYPES.CallExpression:
        return false;

      default:
        throw new Error(
          "Unexpected init type for VariableDeclarator: " + node.init.type
        );
    }
  },

  isTypescript(node) {
    return false;
  },
};
