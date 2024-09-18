import Path from "path";
import FS from "fs";

export type Dependencies = Map<string, string>;

const dependencies = new Map<string, Dependencies>();

const get = (srcPath: string): Dependencies => {
  const deps = dependencies.get(srcPath);

  if (!deps) {
    throw new Error("dependencies have not been set for " + srcPath);
  }

  return deps;
};

const parse = (srcPath: string): Dependencies => {
  const path = Path.resolve(Path.join(srcPath, "../package.json"));
  const file = FS.readFileSync(path, { encoding: "utf-8" });

  if (!file) {
    throw new Error("cannot find package.json file at " + path);
  }
  const pkgJson = JSON.parse(file);
  return new Map(
    Object.entries({
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
    })
  );
};

const set = (srcPath: string): void => {
  dependencies.set(srcPath, parse(srcPath));
};

const isDependency = (srcPath: string, name: string): boolean => {
  const deps = get(srcPath);
  if (deps.has(name)) return true;

  const parts = name.split("/");
  let i = 0;
  let hasDep = false;

  while (i < parts.length && !hasDep) {
    const part = parts.slice(0, i).join("/");
    if (deps.has(part)) {
      hasDep = true;
    }
    i++;
  }

  return hasDep;
};

export default {
  isDependency,
  get,
  set,
};
