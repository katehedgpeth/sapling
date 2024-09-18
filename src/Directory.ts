import { File } from "./File";
import { lstatSync, readdirSync } from "fs";
import path from "path";
import Path from "path";

export const getFilePaths = (
  dirPath: string,
  ignoredPaths: string[]
): string[] => {
  return readdirSync(dirPath, {
    recursive: true,
    encoding: "utf-8",
  })
    .filter(isFile)
    .filter((p) => isNotIgnoredPath(p, ignoredPaths))
    .map((f) => Path.join(dirPath, f));
};

const isNotIgnoredPath = (path: string, ignoredPaths: string[]): boolean => {
  return !ignoredPaths.includes(path);
};

const isFile = (path: string): boolean => {
  return (
    [".ts", ".tsx", ".js", ".jsx"].includes(Path.extname(path)) &&
    !isTestFile(path)
  );
};

const isTestFile = (path: string): boolean => {
  return path.includes(".test") || path.includes(".spec");
};

const EXCLUDE_FILES = ["setupTests"];

export class Directory {
  public files: File[] = [];
  public directories: Directory[] = [];
  constructor(public path: string) {
    const dir = readdirSync(path);
  }
}
