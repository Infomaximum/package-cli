import type { Configuration } from "webpack";
import type { Mode } from "../../../paths.js";
import type { IntegrationPaths } from "../../integrationPaths.js";
import TerserPlugin from "terser-webpack-plugin";
import { systemRequire } from "../../../utils.js";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
export const getCommonIntegrationConfig = (
  mode: Mode,
  PATHS: IntegrationPaths
): Configuration => {
  return {
    mode,
    target: "es5",
    entry: PATHS.moduleIndex,
    output: {
      filename: PATHS.outputFile,
      path: PATHS.appBuildPath,
      clean: true,
      libraryTarget: "module",
      chunkFormat: false,
      asyncChunks: false,
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
          loader: systemRequire.resolve("ts-loader"),
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        async: true,
        typescript: {
          memoryLimit: 2048,
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
    ],
    optimization: {
      minimize: true,
      concatenateModules: true,
      splitChunks: false,
      runtimeChunk: false,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              booleans: false,
            },
          },
        }),
      ],
    },
  };
};
