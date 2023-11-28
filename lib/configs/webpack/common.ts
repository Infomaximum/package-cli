import type { Mode, Paths } from "../../paths.js";
import ZipPlugin from "zip-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";
import webpack, { type Configuration } from "webpack";

const { ProgressPlugin } = webpack;

const isProduction = (mode: Mode) => mode === "production";
const isDevelopment = (mode: Mode) => mode === "development";
export const buildWidgetConfigName = "build-widget";

export const widgetArchiveName = "widget";
export const archiveExt = "zip";
const DEV_SERVER_HOST = "0.0.0.0";
const DEV_SERVER_PORT = 5555;

export const getCommonWidgetConfig = (
  mode: Mode,
  PATHS: Paths
): Configuration => {
  return {
    mode,
    name: buildWidgetConfigName,
    entry: [PATHS.moduleIndex, PATHS.manifestJson],
    output: {
      path: PATHS.appBuild,
      filename: require(PATHS.manifestJson).entry,
      asyncChunks: false,
      clean: true,
    },
    plugins: [
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
      new ZipPlugin({
        filename: widgetArchiveName,
        extension: archiveExt,
      }),
      isDevelopment(mode) && new ReactRefreshWebpackPlugin(),
      isDevelopment(mode) &&
        new JsonModifyWebpackPlugin({
          matchers: [
            {
              matcher: /^manifest.json$/,
              action: (currentJsonContent) => {
                currentJsonContent.entry = `http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}/${currentJsonContent.entry}`;

                return currentJsonContent;
              },
            },
          ],
        }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          exclude: ["/node_modules/"],
          loader: require.resolve("babel-loader"),
          options: {
            plugins: [
              require.resolve("babel-plugin-inline-json-import"),
              require.resolve("@babel/plugin-transform-runtime"),
              !isProduction(mode) && require.resolve("react-refresh/babel"),
            ].filter(Boolean),
          },
        },
        {
          test: /\.css$/i,
          use: [
            require.resolve("style-loader"),
            require.resolve("css-loader"),
            {
              loader: require.resolve("postcss-loader"),
              options: {
                postcssOptions: {
                  plugins: [
                    require.resolve("postcss-preset-env"),
                    require.resolve("autoprefixer"),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            require.resolve("style-loader"),
            require.resolve("css-loader"),
            {
              loader: require.resolve("postcss-loader"),
              options: {
                postcssOptions: {
                  plugins: [
                    require.resolve("postcss-preset-env"),
                    require.resolve("autoprefixer"),
                  ],
                },
              },
            },
            {
              loader: require.resolve("sass-loader"),
              options: {
                implementation: require("sass"),
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
            require.resolve("style-loader"),
            require.resolve("css-loader"),
            {
              loader: require.resolve("postcss-loader"),
              options: {
                postcssOptions: {
                  plugins: [
                    require.resolve("postcss-preset-env"),
                    require.resolve("autoprefixer"),
                  ],
                },
              },
            },
            {
              loader: require.resolve("less-loader"),
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
          test: /\.(eot|ttf|woff|woff2|png|jpg|gif)$/i,
          type: "asset/inline",
        },
        {
          test: /manifest.json$/i,
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
              issuer: /\.[jt]sx?$/,
              loader: require.resolve("@svgr/webpack"),
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
    optimization: isProduction(mode)
      ? {
          minimize: true,
          splitChunks: false,
          minimizer: [
            new TerserWebpackPlugin({
              minify: TerserWebpackPlugin.terserMinify,
              parallel: true,
            }),
            new CssMinimizerPlugin(),
          ],
        }
      : undefined,
    resolve: {
      extensions: [".tsx", ".ts", ""],
      plugins: [new TsconfigPathsPlugin()],
    },
    devtool: isProduction(mode) ? false : "cheap-module-source-map",
  };
};
