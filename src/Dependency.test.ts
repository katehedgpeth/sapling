import { describe, test, expect, beforeAll } from "vitest";
import Path from "path";
import FS from "fs";
import { Import } from "./Import";
import Dependencies from "./Dependencies";
import { Dependency } from "./Dependency";

let srcPath: string;

let imprt: Import;

describe("Dependency", () => {
  beforeAll(() => {
    srcPath = Path.resolve(process.cwd(), "src");
    Dependencies.set(srcPath);
    imprt = new Import({
      specifier: {
        type: "ImportSpecifier",
        imported: { name: "styled", type: "Identifier" },
        local: { name: "styled", type: "Identifier" },
      },
      srcPath,
      importedTo: "wherever",
      importedFrom: "@mui/material",
    });
  });

  describe(".getEntry", () => {
    test("gets the entry path for a dependency", () => {
      const entry = Dependency.getEntry(imprt);
      expect(FS.existsSync(entry)).toBe(true);
    });
  });

  describe(".new", () => {
    test("parses a dependency", () => {
      // expect(srcPath).toBe("FAIL");
      expect(imprt).toBeInstanceOf(Import);
      expect(imprt.name).toBe("styled");

      const dependency = Dependency.new(imprt);
    });
  });
});
