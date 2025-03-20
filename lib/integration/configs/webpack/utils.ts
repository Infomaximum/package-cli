import { type MinifyOptions } from "terser";

const nameCache = {};

export const TERSER_OPTIONS = (isBeautifyCode: boolean) =>
  ({
    nameCache: nameCache,
    mangle: false,
    toplevel: false,
    format: {
      comments: false,
      beautify: isBeautifyCode,
    },
    compress: {
      booleans: false,
      keep_fnames: false,
      toplevel: true,
    },
  }) satisfies MinifyOptions;
