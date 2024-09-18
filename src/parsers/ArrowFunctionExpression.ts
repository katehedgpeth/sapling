import { ArrowFunctionExpression as IArrowFunctionExpression } from "@babel/types";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { Parser } from "./parser";

export const ArrowFunctionExpression: Parser<IArrowFunctionExpression> = {
  getIdentifier(node) {
    throw new Error("ArrowFunctionExpression.getIdentifier not implemented");
  },
  isConstant(node) {
    return false;
  },
  isComponent(node) {
    switch (node.body.type) {
      case AST_NODE_TYPES.JSXElement:
        return true;

      case AST_NODE_TYPES.ObjectExpression:
        return false;
      default:
        throw new Error(
          "Unexpected body type for ArrowFunctionExpression: " + node.body.type
        );
    }
  },

  isTypescript(node) {
    return false;
  },
};
