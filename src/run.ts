import Path from "path";
import * as Directory from "./Directory";
import { File } from "./File";
import { AST } from "./AST";

export const run = (parentFolder: string, ignoredPaths: string[]): AST[] => {
  const path = absolutePath(parentFolder);
  const files = Directory.getFilePaths(path, ignoredPaths)
    .map((p) => parseFile(p, path))
    .map((ast) => ast);
  return files;
};

const parseFile = (filePath: string, parentPath: string): AST => {
  return new AST(filePath, parentPath);
};

export const absolutePath = (path: string): string => {
  if (path.startsWith("~")) {
    return Path.normalize(path.replace("~", process.env.HOME));
  }
  if (!Path.isAbsolute(path)) {
    throw new Error("Expected an absolute file path, but got: " + path);
  }
  return path;
};
