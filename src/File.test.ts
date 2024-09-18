import { describe, test, expect, beforeAll } from "vitest";
import FS from "fs";
import { File } from "./File";
import { Import } from "./Import";
import Dependencies from "./Dependencies";

let file: File;
const SRC_PATH =
  process.env.HOME + "/Documents/github/vetspire/vetspire/web/src/";

describe("File", () => {
  beforeAll(() => {
    Dependencies.set(SRC_PATH);
    file = new File(SRC_PATH + "index.js", SRC_PATH);
  });
  test("Parses AST from a file path", () => {
    expect(Object.keys(file.ast)).toEqual([
      "type",
      "start",
      "end",
      "loc",
      "errors",
      "program",
      "comments",
      "tokens",
    ]);
    expect(file.ast.type).toEqual("File");
    expect(file.ast.errors).toEqual([]);
  });

  test("file.ast.program", () => {
    const program = file.ast.program;

    expect(Object.keys(program)).toEqual([
      "type",
      "start",
      "end",
      "loc",
      "sourceType",
      "interpreter",
      "body",
      "directives",
      "extra",
    ]);
    expect(program.type).toEqual("Program");
    expect(program.directives).toEqual([]);
  });
  test("file.ast.program.body", () => {
    const body = file.ast.program.body;
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toEqual(37);
    // expect(body.map((n) => n.type)).toEqual([]);
  });
  test("file.imports", () => {
    expect(file.imports.length).toEqual(12);
    // expect(file.imports.map((i) => i.path)).toEqual([]);
    const imports = [
      "react-dom",
      "@apollo/client/cache",
      "apollo-absinthe-upload-link",
      "@apollo/client/utilities",
      "apollo-link",
      "apollo-link-context",
      "apollo-link-error",
      "apollo-utilities",
      "emotion",
      "@jumpn/utils-graphql",
      "@newrelic/browser-agent/loaders/browser-agent",
      "@sprig-technologies/sprig-browser",
      "components/Error",
      "constants/strings",
      "images/cat-hiding.jpg",
      "images/dog-reading.jpeg",
      "routing",
      "sentry",
      "utils/absintheSocketLink",
      "utils/auth",
      "utils/safeApollo",
      "vendor/index.css",
    ];
    const error = file.imports[0];
    expect(error.declaration.source.extra.rawValue).toEqual("components/Error");
    expect(error.declaration.specifiers[0].local.name).toEqual("Error");
    expect(error.declaration.specifiers.length).toEqual(1);
    expect(error.declaration.specifiers[0].type).toEqual(
      "ImportDefaultSpecifier"
    );

    expect(error.importPath).toEqual(SRC_PATH + "components/Error/index.ts");
    expect(error.componentName).toEqual("default");
    expect(error.isDefaultImport).toBe(true);
    // expect(imp).toEqual("FAIL");
  });
});
