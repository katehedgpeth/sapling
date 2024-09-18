import { ImportDefaultSpecifier as IImportDefaultSpecifier } from "@babel/types";
import { ImportParser } from "./ImportParser";

export const ImportDefaultSpecifier: ImportParser<IImportDefaultSpecifier> = {
  name(imprt) {
    return imprt.local.name;
  },

  getIdentifier(imprt) {
    return {
      name: this.name(imprt),
      type: "Identifier",
    };
  },

  isComponent(imprt) {
    return false;
  },
  isConstant(imprt) {
    return false;
  },
  isTypescript(imprt) {
    return false;
  },
};
