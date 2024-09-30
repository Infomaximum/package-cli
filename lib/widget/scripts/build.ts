import webpack, {
  type Configuration,
  type WebpackPluginInstance,
} from "webpack";
import { type Mode } from "../../paths.js";
import { getPackageBuildConfig } from "../../package/configs/webpack/buildPackage.js";
import { merge } from "webpack-merge";
import chalk from "chalk";
import { getZipWidgetPlugin } from "../configs/webpack/sections/plugins/zipWidget.js";
import { getModifyManifestWidgetPlugin } from "../configs/webpack/sections/plugins/modifyManifestWidget.js";
import { getCommonWidgetConfig } from "../configs/webpack/common.js";
import { getMinimizer } from "../configs/webpack/sections/plugins/minimizer.js";
import path from "node:path";
import { WIDGET_ARCHIVE_FULL_NAME } from "../const.js";
import { generateWidgetPaths } from "../widgetPaths.js";
import { generatePackagePaths } from "../../package/packagePaths.js";
import { checkLatestLibsVersion } from "../utils.js";
import type { MergedBuildOptions } from "../commands/build.js";

export const runBuild = async (args: MergedBuildOptions) => {
  const mode: Mode = "production";

  const {
    buildDir,
    host,
    port,
    dev: isBuildDevMode,
    packageDir,
    packageManifest,
  } = args;

  const WIDGET_PATHS = generateWidgetPaths(args);

  const sections = {
    plugins: [
      getZipWidgetPlugin({
        isOnlyManifest: isBuildDevMode,
        widgetResourcesDirName: WIDGET_PATHS.widgetResourcesDirName,
      }),
      getModifyManifestWidgetPlugin({
        isBuildDevMode,
        host,
        port,
        WIDGET_PATHS,
      }),
    ] as WebpackPluginInstance[],
  } satisfies Configuration;

  if (isBuildDevMode) {
    // не нужно собирать все приложение, можно только собрать манифест
    (sections as Configuration).entry = WIDGET_PATHS.widgetManifestJsonPath;
  }

  const configSections = [
    getCommonWidgetConfig(mode, WIDGET_PATHS),
    sections,
    getMinimizer(),
  ] as const;

  const widgetConfig = merge(configSections);

  const widgetArchivePath = path.resolve(
    WIDGET_PATHS.appBuildPath,
    WIDGET_ARCHIVE_FULL_NAME,
  );

  try {
    await build(widgetConfig as Configuration);
    console.log("");
    await build(
      await getPackageBuildConfig({
        mode,
        PATHS: generatePackagePaths({
          buildDirPath: buildDir,
          packageDir,
          packageManifest,
        }),
        isBuildDevMode,
        entityArchivePath: widgetArchivePath,
      }),
    );

    await checkLatestLibsVersion();
  } catch (error: any) {
    console.error(chalk.red("\nFailed to compile.\n"));
    console.error(chalk.red(error));
    process.exit(1);
  }
};

function build(config: webpack.Configuration) {
  const compiler = webpack(config);

  return new Promise<void>((res, rej) => {
    compiler.run((err: any, stats) => {
      if (err) {
        console.error(err.stack || err);

        if (err?.details) {
          console.error(err.details);
        }

        rej();
      }

      stats &&
        console.log(
          stats?.toString({
            chunks: false,
            colors: true,
          }),
        );

      res();
    });
  });
}
