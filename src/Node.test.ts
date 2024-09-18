import { describe, test, expect } from "vitest";
import FS from "fs";
import Path from "path";
import { ParseResult } from "@babel/parser";
import {
  File,
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  VariableDeclaration,
  FunctionDeclaration,
} from "@babel/types";

import { Node } from "./Node";

const readMock = (mockName: string): ParseResult<File> => {
  return JSON.parse(
    FS.readFileSync(Path.join(__dirname, "test", "mocks", mockName), {
      encoding: "utf-8",
    })
  );
};

describe("Node", () => {
  test("identifies components defined as exported const", () => {
    const {
      program: { body },
    } = readMock("Accordion.tsx.json");
    const ast = body.find(
      (n) =>
        n.type === "ExportNamedDeclaration" &&
        n.declaration.type === "VariableDeclaration" &&
        n.declaration.kind === "const"
    ) as ExportNamedDeclaration;

    const node = new Node({ ast, filePath: "", srcPath: "" });
    expect(node.is.component, "component").toBe(true);
    expect(node.is.export, "export").toBe(true);
  });

  test("identifies components defined as function", () => {
    const {
      program: { body },
    } = readMock("VetspireSubscriptionDetails.tsx.json");
    const ast = body.find(
      (n) => n.type === "FunctionDeclaration"
    ) as FunctionDeclaration;
    expect(ast, "ast").toBeDefined();
    expect(ast.id.name).toBe("CardLoading");

    const node = new Node({ ast, filePath: "", srcPath: "" });
    expect(Node.getIdentifier(node).name).toBe("CardLoading");
    expect(node.is.component, "component").toBe(true);
    expect(node.is.export, "export").toBe(false);
  });

  test("identifies components defined as exported function", () => {});

  test.only("identifies HOCs", () => {
    const {
      program: { body },
    } = readMock("DeprecatedRecentPatients.js.json");
    const ast = body.find(
      (n) => n.type === "ExportDefaultDeclaration"
    ) as ExportDefaultDeclaration;
    expect(ast, "ast").toBeDefined();
    expect(ast.declaration.type).toBe("CallExpression");
    expect(Object.keys(ast.declaration)).toBe([]);

    // const node = new Node({ ast, filePath: "", srcPath: "" });
    // expect(node.is.component, "component").toBe(true);
    // expect(node.is.export, "export").toBe(true);
  });
});
