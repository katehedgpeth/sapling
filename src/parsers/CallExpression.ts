import {
  ArrowFunctionExpression as IArrowFunctionExpression,
  CallExpression as ICallExpression,
} from "@babel/types";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import * as Parsers from ".";
import { AST } from "../AST";
import { Parser } from "./parser";
import { ArrowFunctionExpression } from "./ArrowFunctionExpression";
import { Identifier } from "./Identifier";
import { ObjectExpression } from "./ObjectExpression";
import Dependencies from "../Dependencies";
import { Import } from "../Import";
import { Dependency } from "../Dependency";

export const CallExpression: Parser<ICallExpression> = {
  getIdentifier(node) {
    throw new Error("CallExpression.getIdentifier not implemented");
  },
  isComponent(node, ast) {
    // console.log(node.arguments);
    if (isHOC(node, ast)) {
      return true;
    }
    switch (node.callee.type) {
      case AST_NODE_TYPES.CallExpression:
        return CallExpression.isComponent(node.callee, ast);

      default:
        return node.arguments.some((arg) => argIsComponent(arg, ast));
    }
  },

  isConstant(node) {
    return false;
  },
  isTypescript(node) {
    return false;
  },
};

const isHOC = (node: ICallExpression, ast: AST): boolean => {
  if (node.callee.type === AST_NODE_TYPES.Identifier) {
    // console.log({ ast, callee: node.callee, arguments: node.arguments });
    const name = node.callee.name;
    const callee = ast.nodes.get(name);
    if (callee instanceof Import && callee.is.dependency) {
      return Dependency.isHOC(callee);
    }

    return false;
  } else {
    return false;
  }
};

const argIsComponent = (
  arg: ICallExpression["arguments"][number],
  file: AST
): boolean => {
  switch (arg.type) {
    case AST_NODE_TYPES.ArrowFunctionExpression:
      return ArrowFunctionExpression.isComponent(arg, file);

    case AST_NODE_TYPES.Identifier:
      return Identifier.isComponent(arg, file);

    case AST_NODE_TYPES.ObjectExpression:
      return ObjectExpression.isComponent(arg, file);

    default:
      throw new Error(
        "Unexpected argument type for CallExpression argument: " + arg.type
      );
  }
};
