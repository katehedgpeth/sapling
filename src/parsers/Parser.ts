import { Identifier } from "@babel/types";
import { AST } from "../AST";

export interface Parser<T, Id extends Identifier | undefined = Identifier> {
  getIdentifier(node: T): Id;

  isComponent(node: T, ast: AST): boolean;

  isConstant(node: T): boolean;

  isTypescript(node: T): boolean;
}
