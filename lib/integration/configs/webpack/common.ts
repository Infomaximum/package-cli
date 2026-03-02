import webpack from "webpack";
import type { Configuration } from "webpack";
import type { Mode } from "../../../paths.js";
import type { IntegrationPaths } from "../../integrationPaths.js";
import TerserPlugin from "terser-webpack-plugin";
import { systemRequire } from "../../../utils.js";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TERSER_OPTIONS } from "./utils.js";

type CommonBuildIntegrationParams = {
  mode: Mode;
  PATHS: IntegrationPaths;
  isBeautifyCode: boolean;
};

export const getCommonIntegrationConfig = ({
  PATHS,
  mode,
  isBeautifyCode,
}: CommonBuildIntegrationParams): Configuration => {
  const isDev = mode === "development";

  return {
    mode,
    target: ["web", "es5"],
    entry: PATHS.moduleIndex,
    output: {
      filename: PATHS.outputFile,
      path: PATHS.appBuildPath,
      clean: true,
      library: {
        type: "module",
      },
      chunkFormat: false,
      asyncChunks: false,
    },
    experiments: {
      outputModule: true,
    },
    resolve: {
      extensions: [".ts", ".js", ".json"],
      fallback: {
        stream: systemRequire.resolve("stream-browserify"),
        util: systemRequire.resolve("util/"),
        zlib: systemRequire.resolve("browserify-zlib"),
        vm: systemRequire.resolve("vm-browserify"),
        crypto: systemRequire.resolve("crypto-browserify"),
        buffer: systemRequire.resolve("buffer/"),
        process: systemRequire.resolve("process/browser"),
        assert: systemRequire.resolve("assert/"),
        path: false,
        fs: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|ts|jsx|tsx)$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: systemRequire.resolve("babel-loader"),
              options: {
                cacheDirectory: true,
              },
            },
            {
              loader: systemRequire.resolve("ts-loader"),
              options: {
                transpileOnly: true,
                happyPackMode: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: systemRequire.resolve("process/browser"),
        Buffer: [systemRequire.resolve("buffer/"), "Buffer"],
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      new ForkTsCheckerWebpackPlugin({
        async: isDev,
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
      minimize: !isDev || !isBeautifyCode,
      concatenateModules: true,
      splitChunks: false,
      runtimeChunk: false,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: TERSER_OPTIONS(isBeautifyCode),
        }),
      ],
    },
    stats: isDev ? "errors-warnings" : "normal",
    performance: {
      hints: isDev ? false : "warning",
    },
  };
};
