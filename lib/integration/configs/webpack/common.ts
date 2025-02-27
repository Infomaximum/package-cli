import type { Configuration } from "webpack";
import type { Mode } from "../../../paths.js";
import type { IntegrationPaths } from "../../integrationPaths.js";
import TerserPlugin from "terser-webpack-plugin";
import { systemRequire } from "../../../utils.js";

export const getCommonIntegrationConfig = (
  mode: Mode,
  PATHS: IntegrationPaths
): Configuration => {
  return {
    mode,
    entry: PATHS.moduleIndex,
    output: {
      filename: PATHS.outputFile,
      path: PATHS.appBuildPath,
      clean: true,
      libraryTarget: "module",
    },
    experiments: {
      outputModule: true,
    },
    resolve: {
      extensions: [".ts", ".js", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts|jsx|tsx)$/i,
          exclude: ["/node_modules/"],
          loader: systemRequire.resolve("babel-loader"),
          options: {
            plugins: [
              systemRequire.resolve("babel-plugin-inline-json-import"),
              systemRequire.resolve("@babel/plugin-transform-runtime"),
            ].filter(Boolean),
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      concatenateModules: true,
      splitChunks: false,
      runtimeChunk: false,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              booleans: false,
            },
          },
        }),
      ],
    },
  };
};
