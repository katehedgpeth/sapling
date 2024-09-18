import {
  ObjectExpression as IObjectExpression,
  CallExpression as ICallExpression,
} from "@babel/types";

import { Parser } from "./parser";

export const ObjectExpression: Parser<IObjectExpression, undefined> = {
  getIdentifier() {},

  isComponent(node) {
    // node.properties.forEach((prop) => console.log(prop));
    return false;
  },

  isConstant() {
    return false;
  },

  isTypescript() {
    return false;
  },
};
