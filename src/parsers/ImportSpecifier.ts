import { ImportSpecifier as IImportSpecifier, Identifier } from "@babel/types";
import { ImportParser } from "./ImportParser";

export const ImportSpecifier: ImportParser<IImportSpecifier> = {
  name(imprt): string {
    return imprt.local.name;
  },
};
