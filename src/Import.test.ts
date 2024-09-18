import FS from "fs";
import Path from "path";
import { describe, test, expect, beforeAll } from "vitest";
import { parse, ParseResult } from "@babel/parser";
import { File as IFile, ImportDeclaration } from "@babel/types";
import { File } from "./File";
import { Import } from "./Import";
import Dependencies from "./Dependencies";

const SRC_PATH = Path.join(
  process.env.HOME,
  "/Documents/github/vetspire/vetspire/web/src"
);
let ast: ParseResult<IFile>;

describe("Import", () => {
  beforeAll(() => {
    const path = Path.join(SRC_PATH, "index.js");
    const file = File.readFile(path);
    Dependencies.set(SRC_PATH);
    ast = File.parseAst(file);
  });

  describe("constructor", () => {
    test("sets componentName", () => {
      const component = ast.program.body.find((parsed) => {
        return (
          parsed.type === "ImportDeclaration" &&
          (parsed.source.extra.rawValue as string) === "utils/auth"
        );
      }) as ImportDeclaration;
      const imprt = new Import(component, SRC_PATH);
      expect(imprt.componentName).toEqual("utils/auth");
    });
  });

  describe("isLocalImport", () => {
    test("returns false for package imports", () => {
      const react = ast.program.body.find(
        (parsed) =>
          parsed.type === "ImportDeclaration" &&
          parsed.source.extra.rawValue === "react-dom"
      ) as ImportDeclaration;
      expect(react.type).toEqual("ImportDeclaration");
      const value = react.source.extra.rawValue as string;
      const pkg = value.split("/")[0];
      expect(value).toEqual("react-dom");
      expect(Import.isLocalImport(react, SRC_PATH)).toBe(false);
    });
  });
});
