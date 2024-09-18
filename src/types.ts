import {
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
  TSEnumDeclaration,
} from "@babel/types";
// import { TSESTree } from "@typescript-eslint/types";

export type TSDeclaration =
  | TSTypeAliasDeclaration
  | TSInterfaceDeclaration
  | TSEnumDeclaration;
