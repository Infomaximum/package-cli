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
      keep_numbers: true,
      braces: true,
    },
    compress: {
      booleans: false,
      keep_fnames: false,
      toplevel: true,
      join_vars: false,
      sequences: false,
      unsafe_undefined: false,
      hoist_vars: false,
      hoist_funs: false,
      hoist_props: false,
      typeofs: false,
      arrows: false,
    },
  }) satisfies MinifyOptions;
