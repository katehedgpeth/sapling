import { describe, test, expect } from "vitest";
import FS from "fs";
import Path from "path";
import { ParseResult } from "@babel/parser";
import { File, ExportDefaultDeclaration, CallExpression } from "@babel/types";
import { isComponent } from "./CallExpression";
import { AST } from "../AST";

const readMock = (mockName: string): ParseResult<File> => {
  return JSON.parse(
    FS.readFileSync(Path.join(__dirname, "..", "test", "mocks", mockName), {
      encoding: "utf-8",
    })
  );
};

const SRC_PATH =
  process.env.HOME + "/Documents/github/vetspire/vetspire/web/src";

describe("CallExpression.isComponent", () => {
  test("returns true if CallExpression is a higher-order component", () => {
    const ast = new AST(
      Path.join(SRC_PATH, "app", "OldInventory", "dashboard.js"),
      SRC_PATH
    );
    expect(ast, "ast").toBeDefined();
    const node = AST.getNodeByIdentifier(ast, {
      name: "default",
      type: "Identifier",
    });
    expect(node).toBeDefined();
    expect(node.ast.type).toBe("ExportDefaultDeclaration");
    // @ts-ignore
    const exportDefault = node.ast.declaration as ExportDefaultDeclaration;
    expect(exportDefault.type).toBe("CallExpression");
    expect(isComponent(exportDefault.declaration as CallExpression, ast)).toBe(
      true
    );
  });
});
