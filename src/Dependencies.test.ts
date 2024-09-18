import { describe, test, expect, beforeAll } from "vitest";
import Path from "path";

import Dependencies from "./Dependencies";

const SRC_PATH = Path.join(
  process.env.HOME,
  "/Documents/github/vetspire/vetspire/web/src"
);

describe("Dependencies.set", () => {
  test("should set dependencies", () => {
    Dependencies.set(SRC_PATH);
    expect(Dependencies.get(SRC_PATH).get("react-dom")).toBe("17.0.0");
  });

  test("throws an error if path is incorrect", () => {
    expect(() => Dependencies.set("does/not/exist")).toThrowError(
      "ENOENT: no such file or directory, open '/Users/kateleahy/Documents/github/katehedgpeth/sapling/does/not/package.json'"
    );
  });
});

describe("Dependencies.isDependency", () => {
  beforeAll(() => {
    Dependencies.set(SRC_PATH);
  });
  test("returns true for dependencies with no slash", () => {
    expect(Dependencies.isDependency(SRC_PATH, "react-dom")).toBe(true);
  });
  test("returns true for dependencies with a slash", () => {
    expect(Dependencies.isDependency(SRC_PATH, "@styled-icons/material")).toBe(
      true
    );
  });
  test("returns false for non-dependencies", () => {
    expect(Dependencies.isDependency(SRC_PATH, "hooks")).toBe(false);
  });
});
