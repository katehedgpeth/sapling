import { describe, test, expect } from "vitest";

import { run } from "./run";
import { File } from "./File";

describe("run", () => {
  test("run", () => {
    const files = run("~/Documents/github/vetspire/vetspire/web/src", [
      "index.electron.js",
      "setupTests.ts",
    ]);
    expect(files.length).toEqual(1441);
    files.forEach((file) => {
      expect(file.exports.length, file.path).toBeGreaterThan(0);
      file.exports.forEach((exp) => {
        expect(exp.id.length).toEqual(32);
        expect(
          ["ExportNamedDeclaration", "ExportDefaultDeclaration"].includes(
            exp.exportMethod
          )
        ).toBe(true);
      });
    });
    // files.map();
  });
});

// const testFile = ({ file, path, ast }: File): void => {
//   console.warn(path);
//   // expect(path).toEqual("FAIL");
//   expect(Object.keys(ast)).toEqual("FAIL");
//   expect(file).not.toEqual("");
//   // expect(ast).toEqual({});
// };
