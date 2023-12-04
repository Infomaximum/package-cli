import ZipPlugin from "zip-webpack-plugin";
import RemovePlugin from "remove-files-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import type { Mode, Paths } from "../../paths.js";
import path from "path";
import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";
import { systemRequire } from "../../utils.js";
import {
  BUILD_ARCHIVE_EXT,
  BUILD_WIDGET_CONFIG_NAME,
  MANIFEST_REG_EXP,
  WIDGET_ARCHIVE_FULL_NAME,
} from "../../const.js";
import type { Configuration } from "webpack";

const packageFilename = "main.js";

export const getPackageConfig = (
  mode: Mode,
  PATHS: Paths,
  isBuildDevMode: boolean
) => {
  const widgetVersion = systemRequire(PATHS.appPackageJson).version;
  const manifestPackageName = systemRequire(PATHS.packageManifest).name;

  let widgetPackageName = `${manifestPackageName}_${widgetVersion}`;

  if (isBuildDevMode) widgetPackageName += "__DEV";

  return {
    mode,
    name: "package",
    entry: [
      PATHS.packageManifest,
      path.resolve(PATHS.appBuild, WIDGET_ARCHIVE_FULL_NAME),
    ],
    output: {
      path: PATHS.appBuild,
      filename: packageFilename,
      clean: true,
    },
    module: {
      rules: [
        {
          test: MANIFEST_REG_EXP,
          type: "asset/resource",
          generator: {
            filename: "manifest[ext]",
          },
        },
        {
          test: new RegExp(`.${BUILD_ARCHIVE_EXT}$`, "i"),
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
      new RemovePlugin({
        after: {
          root: PATHS.appBuild,
          test: [
            {
              folder: ".",
              method: () => true,
              recursive: true,
            },
          ],
          exclude: [`${widgetPackageName}.${BUILD_ARCHIVE_EXT}`],
        },
      }),
      new ZipPlugin({
        filename: widgetPackageName,
        extension: BUILD_ARCHIVE_EXT,
        exclude: [packageFilename],
      }),
      new JsonModifyWebpackPlugin({
        matchers: [
          {
            matcher: MANIFEST_REG_EXP,
            action: (currentJsonContent) => {
              currentJsonContent.version = widgetVersion;

              return currentJsonContent;
            },
          },
        ],
      }),
    ],
    dependencies: [BUILD_WIDGET_CONFIG_NAME],
  } satisfies Configuration;
};
