import { parse, ParseResult } from "@babel/parser";
import { File as IFile, ImportDeclaration } from "@babel/types";
import Path from "path";
import FS from "fs";
import { Import } from "./Import";

export class File {
  public ast: ParseResult<IFile>;
  public imports: Import[] = [];

  constructor(public path: string, srcPath: string) {
    const file = File.readFile(path);
    this.ast = File.parseAst(file);

    this.parse(srcPath);
  }

  parse(srcPath: string): File {
    return this.parseImports(srcPath).parseExports(srcPath);
  }

  parseImports(srcPath: string): File {
    // this.imports = this.ast.program.body
    //   .filter((i) => Import.isLocalImport(i, srcPath))
    //   .map((i) => new Import(i, srcPath));

    return this;
  }

  parseExports(srcPath: string): File {
    return this;
  }
}
