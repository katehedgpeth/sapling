import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import { Export, Props } from "../Export";
import { TSDeclaration } from "../types";

export class Type extends Export<TSDeclaration> {
  public name: TSDeclaration["id"]["name"];
  public type: TSDeclaration["type"];

  constructor(props: Props) {
    super(props);
    const {
      id: { name },
      type,
    } = props.declaration;
    this.name = name;
    this.type = type;
  }
}
