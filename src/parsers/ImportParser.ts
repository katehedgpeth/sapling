import { Parser } from "./parser";

export interface ImportParser<T> extends Parser<T> {
  name(specifier: T): string;
}
