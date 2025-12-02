import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import webpack, { type Configuration } from "webpack";
import { applicationCssLoaders } from "./sections/loaders/cssLoaders.js";
import type { Mode } from "../../../paths.js";
import { compact, systemRequire } from "../../../utils.js";
import { MANIFEST_REG_EXP } from "../../../const.js";
import type { ApplicationPaths } from "../../applicationPaths.js";
import {
  APPLICATION_OUTPUT_FILE_NAME,
  APPLICATION_OUTPUT_FULL_FILE_NAME,
} from "../../const.js";

const { ProgressPlugin } = webpack;

const isProduction = (mode: Mode) => mode === "production";
const isDevelopment = (mode: Mode) => mode === "development";

export const getCommonApplicationWebpackConfig = (
  mode: Mode,
  PATHS: ApplicationPaths
): Configuration => {
  const manifestEntry = systemRequire(PATHS.applicationManifestJsonPath).entry;

  const filename = isProduction(mode)
    ? `${APPLICATION_OUTPUT_FILE_NAME}.[contenthash].js`
    : APPLICATION_OUTPUT_FULL_FILE_NAME;

  return {
    mode,
    entry: [PATHS.moduleIndex, PATHS.applicationManifestJsonPath],
    output: {
      path: PATHS.appBuildPath,
      filename: manifestEntry ?? filename,
      asyncChunks: false,
      clean: true,
    },
    plugins: compact([
      new ProgressPlugin(),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          mode: "write-references",
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
    ]),
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
              !isProduction(mode) &&
                systemRequire.resolve("react-refresh/babel"),
            ].filter(Boolean),
          },
        },
        {
          test: /\.css$/i,
          use: applicationCssLoaders,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            ...applicationCssLoaders,
            {
              loader: systemRequire.resolve("sass-loader"),
              options: {
                implementation: systemRequire("sass"),
                sassOptions: {
                  fiber: false,
                },
              },
            },
          ],
        },
        {
          test: /\.less$/i,
          use: [
            ...applicationCssLoaders,
            {
              loader: systemRequire.resolve("less-loader"),
              options: {
                sourceMap: isDevelopment(mode),
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(eot|ttf|woff|woff2|png|jpg|jpeg|webp|gif)$/i,
          type: "asset/inline",
        },
        {
          test: MANIFEST_REG_EXP,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /\.svg$/i,
          oneOf: [
            {
              type: "asset",
              resourceQuery: /url/, // *.svg?url
              parser: {
                dataUrlCondition: {
                  maxSize: 64 * 1024, // 64kb
                },
              },
              generator: {
                filename: "build/static/[hash][ext][query]",
              },
            },
            {
              type: "asset/source",
              resourceQuery: /src/, // *.svg?src
            },
            {
              issuer: /\.[jt]sx?$/,
              loader: systemRequire.resolve("@svgr/webpack"),
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      plugins: [new TsconfigPathsPlugin()],
    },
  };
};
