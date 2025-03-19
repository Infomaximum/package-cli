import { type MinifyOptions } from "terser";

const nameCache = {};

export const TERSER_OPTIONS = (isBeautifyCode: boolean) =>
  ({
    nameCache: nameCache,
    mangle: false,
    toplevel: false,
    format: {
      comments: false,
      beautify: true,
    },
    compress: {
      booleans: isBeautifyCode,
      keep_fnames: false,
      toplevel: true,
    },
  }) satisfies MinifyOptions;
