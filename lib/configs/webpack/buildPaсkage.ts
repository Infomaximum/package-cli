import ZipPlugin from "zip-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import type { Mode, Paths } from "../../paths.js";
import path from "path";
import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";
import { systemRequire } from "../../utils.js";
import {
  BUILD_ARCHIVE_EXT,
  BUILD_WIDGET_CONFIG_NAME,
  WIDGET_ARCHIVE_NAME,
} from "../../const.js";
import type { Configuration } from "webpack";

const packageFilename = "main.js";

export const getPackageConfig = (mode: Mode, PATHS: Paths) => {
  const widgetVersion = systemRequire(PATHS.appPackageJson).version;
  const manifestPackageName = systemRequire(PATHS.packageManifest).name;

  return {
    mode,
    name: "package",
    entry: [
      PATHS.packageManifest,
      path.resolve(
        PATHS.appBuild,
        `${WIDGET_ARCHIVE_NAME}.${BUILD_ARCHIVE_EXT}`
      ),
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
      new ZipPlugin({
        filename: `${manifestPackageName}_${widgetVersion}`,
        extension: BUILD_ARCHIVE_EXT,
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
    dependencies: [BUILD_WIDGET_CONFIG_NAME],
  } satisfies Configuration;
};
