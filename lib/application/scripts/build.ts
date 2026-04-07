import { type Configuration, type WebpackPluginInstance } from "webpack";
import { type Mode } from "../../paths.js";
import { getPackageBuildConfig } from "../../package/configs/webpack/buildPackage.js";
import { merge } from "webpack-merge";
import chalk from "chalk";
import path from "node:path";
import { APPLICATION_ARCHIVE_FULL_NAME } from "../const.js";
import { generateApplicationPaths } from "../applicationPaths.js";
import { generatePackagePaths } from "../../package/packagePaths.js";
import type { MergedApplicationBuildOptions } from "../commands/build.js";
import { runWebpackBuild } from "../../utils.js";
import { getZipApplicationPlugin } from "../configs/webpack/sections/plugins/zipApplication.js";
import { getApplicationMinimizer } from "../configs/webpack/sections/plugins/minimizer.js";
import { getCommonApplicationWebpackConfig } from "../configs/webpack/common.js";
import { getModifyManifestApplicationPlugin } from "../configs/webpack/sections/plugins/modifyManifestApplication.js";

export const runApplicationBuild = async (
  args: MergedApplicationBuildOptions
) => {
  const mode: Mode = "production";

  const {
    buildDir,
    host,
    port,
    dev: isBuildDevMode,
    packageDir,
    packageManifest,
    type = "package",
  } = args;

  const APPLICATION_PATHS = generateApplicationPaths(args);

  const isScriptBuild = type === "script";

  const plugins = isScriptBuild ? [] : [      
        getZipApplicationPlugin({
          isOnlyManifest: isBuildDevMode,
        }),
        getModifyManifestApplicationPlugin({
          isBuildDevMode,
          host,
          port,
          APPLICATION_PATHS,
        }),]

  const sections = {
    plugins
  } satisfies Configuration;

  if (isBuildDevMode) {
    // не нужно собирать все приложение, можно только собрать манифест
    (sections as Configuration).entry =
      APPLICATION_PATHS.applicationManifestJsonPath;
  }

  const configSections = [
    getCommonApplicationWebpackConfig(mode, APPLICATION_PATHS, isScriptBuild),
    sections,
    getApplicationMinimizer(),
  ] as const;

  const applicationConfig = merge(configSections);

  const applicationArchivePath = path.resolve(
    APPLICATION_PATHS.appBuildPath,
    APPLICATION_ARCHIVE_FULL_NAME
  );

  try {
    await runWebpackBuild(applicationConfig as Configuration);

    if (!isScriptBuild) {
      console.log("");
      await runWebpackBuild(
        await getPackageBuildConfig({
          mode,
          PATHS: generatePackagePaths({
            buildDir,
            packageDir,
            packageManifest,
          }),
          isBuildDevMode,
          entityArchivePath: applicationArchivePath,
        })
      );
    }
  } catch (error: any) {
    console.error(chalk.red("\nFailed to compile.\n"));
    console.error(chalk.red(error));
    process.exit(1);
  }
};
