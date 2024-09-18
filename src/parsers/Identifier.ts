import { Identifier as IIdentifier } from "@babel/types";
import { AST } from "../AST";
import { Node } from "../Node";

export const Identifier = {
  isComponent(identifier: IIdentifier, file: AST): boolean {
    const node = AST.getNodeByIdentifier(file, identifier);

    return Node.isComponent(node, file);
  },

  isPascalCase(node: IIdentifier): boolean {
    return /^[A-Z][a-z]*$/.test(node.name);
  },
};
