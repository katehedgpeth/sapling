import { describe, test, expect, beforeAll } from "vitest";
import {
  ArrowFunctionExpression,
  VariableDeclaration,
  ExportNamedDeclaration,
} from "@babel/types";
import Path from "path";
import { AST } from "./AST";
import { Export, ExportType } from "./Export";
import { Type } from "./exports/Type";
import { Node } from "./Node";
import Dependencies from "./Dependencies";
import { ArrowFunction } from "typescript";

describe("function", () => {});

describe("AST", () => {
  const SRC_PATH =
    process.env.HOME + "/Documents/github/vetspire/vetspire/web/src";

  beforeAll(() => {
    Dependencies.set(SRC_PATH);
  });

  test.skip("write mock", () => {
    const path = Path.join(SRC_PATH, "app/OldInventory/dashboard.js");
    const ast = new AST(path, SRC_PATH);
  });

  test("parses a file", () => {
    const ast = new AST(Path.join(SRC_PATH, "index.js"), SRC_PATH);
    expect(ast).toBeInstanceOf(AST);
    expect(ast.nodes).toBeInstanceOf(Map);
    expect(Array.from(ast.nodes.keys())).toEqual([]);
  });

  test("parses an index file", () => {
    const ast = new AST(Path.join(SRC_PATH, "hooks/index.ts"), SRC_PATH);
    expect(ast.exports.length).toEqual(13);
    expect(Object.keys(ast.nodes).length).toEqual(0);
  });

  test("parses a file with components", () => {
    const ast = new AST(
      Path.join(SRC_PATH, "shared/atomic/Accordion.tsx"),
      SRC_PATH
    );
    const nodes = Array.from(ast.nodes.values());
    expect(ast.exports.length).toEqual(3);
    const exportId1 = ast.exports[0];
    const node = nodes.find(
      (node) => node.id === exportId1
    ) as Node<ExportNamedDeclaration>;
    // expect(nodes[0]).toEqual("FAIL");
    expect(Array.from(Object.keys(node.ast))).toEqual([
      "type",
      "start",
      "end",
      "loc",
      "exportKind",
      "specifiers",
      "source",
      "declaration",
    ]);
    expect(node.ast.exportKind).toEqual("value");
    expect(node.ast.specifiers).toEqual([]);
    expect(node.ast.source).toEqual(null);
    expect(node.ast.type).toEqual("ExportNamedDeclaration");

    const declaration = node.ast.declaration as VariableDeclaration;
    expect(Object.keys(declaration)).toEqual([
      "type",
      "start",
      "end",
      "loc",
      "declarations",
      "kind",
    ]);
    expect(declaration.kind).toEqual("const");
    expect(declaration.type).toEqual("VariableDeclaration");
    expect(declaration.declarations.length).toEqual(1);
    const declarator = declaration.declarations[0];
    expect(Object.keys(declarator)).toEqual([
      "type",
      "start",
      "end",
      "loc",
      "id",
      "init",
    ]);
    expect(declarator.type).toEqual("VariableDeclarator");
    const init = declarator.init as ArrowFunctionExpression;
    expect(Object.keys(init)).toEqual([
      "type",
      "start",
      "end",
      "loc",
      "id",
      "generator",
      "async",
      "params",
      "body",
    ]);
    expect(init.generator).toEqual(false);
    expect(init.type).toEqual("ArrowFunctionExpression");
    expect(init.body.type).toEqual("JSXElement");
  });

  test.only("parses a file with components, cont'd", () => {
    const ast = new AST(
      Path.join(SRC_PATH, "shared/atomic/Accordion.tsx"),
      SRC_PATH
    );
    // expect(ast.localImports.length).toEqual(2);
    const nodes = Array.from(ast.nodes.values());
    const nodeNames = Array.from(ast.nodes.keys());
    expect(nodeNames).toEqual([
      "StyledAccordionProps",
      "StyledAccordion",
      "StyledAccordionSummary",
      "Accordion",
      "AccordionSummary",
      "AccordionDetails",
    ]);
    const StyledAccordionProps = ast.nodes.get("StyledAccordionProps");
    expect(StyledAccordionProps.is).toEqual({
      component: true,
      type: true,
      constant: false,
      dependency: false,
      export: false,
      function: false,
      import: false,
    });

    expect(ast.nodes.get("StyledAccordion").is).toEqual({
      component: true,
      type: false,
      constant: false,
      dependency: false,
      export: false,
      function: false,
      import: false,
    });

    expect(ast.nodes.get("StyledAccordionSummary").is).toEqual({
      component: false,
      type: false,
      constant: false,
      dependency: false,
      export: false,
      function: false,
      import: false,
    });

    expect(ast.nodes.get("Accordion").is).toEqual({
      component: true,
      type: false,
      constant: false,
      dependency: false,
      export: true,
      function: false,
      import: false,
    });

    expect(ast.nodes.get("AccordionSummary").is).toEqual({
      component: true,
      type: false,
      constant: false,
      dependency: false,
      export: true,
      function: false,
      import: false,
    });

    expect(ast.nodes.get("AccordionDetails").is).toEqual({
      component: true,
      type: false,
      constant: false,
      dependency: false,
      export: true,
      function: false,
      import: false,
    });
  });
});
