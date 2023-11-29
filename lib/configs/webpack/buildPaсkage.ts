import ZipPlugin from "zip-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import {
  archiveExt,
  buildWidgetConfigName,
  widgetArchiveName,
} from "./common.js";
import type { Mode, Paths } from "../../paths.js";
import path from "path";
import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";
import { systemRequire } from "../../utils.js";

const packageFilename = "main";

export const getPackageConfig = (mode: Mode, PATHS: Paths) => {
  const widgetVersion = systemRequire(PATHS.appPackageJson).version;
  const manifestPackageName = systemRequire(PATHS.packageManifest).name;

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
