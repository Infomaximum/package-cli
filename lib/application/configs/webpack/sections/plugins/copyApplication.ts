import type { ObjectPattern } from "copy-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export const getCopyApplicationPlugin = (patterns: ObjectPattern[]) => {
  return patterns.length && new CopyPlugin({ patterns });
};
