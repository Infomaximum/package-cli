import ZipPlugin from "zip-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { archiveExt, buildWidgetConfigName, widgetArchiveName } from "./common";
import { Mode } from "fs";
import { Paths } from "../../paths";
import path from "path";
import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";

const packageFilename = "main.js";

export const getPackageConfig = (mode: Mode, PATHS: Paths) => {
  const widgetVersion = require(PATHS.appPackageJson).version;
  const manifestPackageName = require(PATHS.packageManifest).name;

  return {
    mode,
    name: "package",
    entry: [
      PATHS.packageManifest,
      path.resolve(PATHS.appBuild, `${widgetArchiveName}.${archiveExt}`),
    ],
    output: {
      path: PATHS.appBuild,
      filename: packageFilename,
      clean: true,
    },
    module: {
      rules: [
        {
          test: /manifest.json$/i,
          type: "asset/resource",
          generator: {
            filename: "manifest[ext]",
          },
        },
        {
          test: new RegExp(`.${archiveExt}$`, "i"),
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: PATHS.packagePath }],
      }),
      new ZipPlugin({
        filename: `${manifestPackageName}_${widgetVersion}`,
        extension: archiveExt,
        exclude: [packageFilename],
      }),
      new JsonModifyWebpackPlugin({
        matchers: [
          {
            matcher: /^manifest.json$/,
            action: (currentJsonContent) => {
              currentJsonContent.version = widgetVersion;

              return currentJsonContent;
            },
          },
        ],
      }),
    ],
    dependencies: [buildWidgetConfigName],
  };
};
