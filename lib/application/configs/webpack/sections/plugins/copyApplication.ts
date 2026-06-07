import type { ObjectPattern } from "copy-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export const getCopyApplicationPlugin = (
  patterns: (ObjectPattern | undefined | false)[],
) => {
  const filteredPatterns = patterns.filter<ObjectPattern>((x) => !!x);
  return new CopyPlugin({ patterns: filteredPatterns });
};
