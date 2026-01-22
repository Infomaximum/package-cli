import ZipPlugin from "zip-webpack-plugin";
import RemovePlugin from "remove-files-webpack-plugin";
import CopyWebpackPlugin, { type ObjectPattern } from "copy-webpack-plugin";
import type { Mode } from "../../../paths.js";
import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";
import {
  compact,
  isExist,
  removeServiceFieldsForDevelopment,
  systemRequire,
} from "../../../utils.js";
import {
  BUILD_ARCHIVE_EXT,
  DEV_POSTFIX,
  MANIFEST_REG_EXP,
} from "../../../const.js";
import type { Configuration, WebpackPluginInstance } from "webpack";
import { assertSimple } from "@infomaximum/assert";
import type { PackagePaths } from "../../packagePaths.js";

const packageFilename = "main.js";

type Params = {
  mode: Mode;
  PATHS: PackagePaths;
  isBuildDevMode: boolean;
  entityArchivePath?: string;
  copyFiles?: ObjectPattern[];
};

export const getPackageBuildConfig = async ({
  mode,
  PATHS,
  isBuildDevMode,
  entityArchivePath,
  copyFiles = [],
}: Params) => {
  const entityVersion = systemRequire(PATHS.appPackageJson).version;
  const manifestPackageName = systemRequire(PATHS.packageManifestPath).name;

  let entityPackageName = `${manifestPackageName}_${entityVersion}`;

  if (isBuildDevMode) entityPackageName += DEV_POSTFIX;

  assertSimple(
    await isExist(PATHS.packageManifestPath),
    `File ${PATHS.packageManifestPath} not found`
  );

  entityArchivePath &&
    assertSimple(
      await isExist(entityArchivePath),
      `File ${entityArchivePath} not found`
    );

  return {
    mode,
    entry: compact([PATHS.packageManifestPath, entityArchivePath]),
    output: {
      path: PATHS.appBuildPath,
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
        patterns: [{ from: PATHS.packagePath }, ...copyFiles],
      }) as unknown as WebpackPluginInstance,
      new RemovePlugin({
        after: {
          log: false,
          root: PATHS.appBuildPath,
          test: [
            {
              folder: ".",
              method: () => true,
              recursive: true,
            },
          ],
          exclude: [`${entityPackageName}.${BUILD_ARCHIVE_EXT}`],
        },
      }) as unknown as WebpackPluginInstance,
      new ZipPlugin({
        filename: entityPackageName,
        extension: BUILD_ARCHIVE_EXT,
        exclude: [packageFilename],
      }) as unknown as WebpackPluginInstance,
      new JsonModifyWebpackPlugin({
        matchers: [
          {
            matcher: MANIFEST_REG_EXP,
            action: (currentJsonContent) => {
              currentJsonContent.version = entityVersion;

              const packageName = currentJsonContent.name;

              if (isBuildDevMode && typeof packageName === "string") {
                Object.assign(currentJsonContent, {
                  name: packageName + DEV_POSTFIX,
                });
              }

              removeServiceFieldsForDevelopment(currentJsonContent);

              return currentJsonContent;
            },
          },
        ],
      }) as unknown as WebpackPluginInstance,
    ],
  } satisfies Configuration;
};
