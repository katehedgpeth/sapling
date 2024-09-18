import Path from "path";
import FS from "fs";
import { parseExpression, ParseResult } from "@babel/parser";
import { Expression } from "@babel/types";
import { Import } from "./Import";

type AST = ParseResult<Expression>;
const PARSED = new Map<string, AST>();

interface Is {
  HOC: boolean;
}

export class Dependency {
  public name: string;
  public is: Is = {
    HOC: false,
  };

  private srcPath: string;

  static async get(imprt: Import): Promise<AST> {
    const parsed = PARSED.get(imprt.srcPath);
    if (!parsed) {
      return Dependency.new(imprt);
    }
    return Promise.resolve(parsed);
  }

  static async new(imprt: Import): Promise<AST> {
    const parsed = await Dependency.parse(imprt);
    PARSED.set(imprt.srcPath, parsed);
    return parsed;
  }

  static async isHOC(imprt: Import): Promise<boolean> {
    const ast = await Dependency.get(imprt);
    // return dep.is.HOC;
    return false;
  }

  static getEntry(imprt: Import): string {
    return Path.resolve(
      Path.join(imprt.srcPath, "..", "node_modules", imprt.importedFrom)
    );
  }

  static async parse(imprt: Import): Promise<AST> {
    const entryPath = Dependency.getEntry(imprt);
    const imported = await import(entryPath);

    const ast = parseExpression(imported);

    console.log(ast);
    return ast;
  }
}
