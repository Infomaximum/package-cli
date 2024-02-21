import webpack, {
  type Configuration,
  type WebpackPluginInstance,
} from "webpack";
import type { BuildOptions } from "../../arguments.js";
import { type Mode, generatePaths } from "../../paths.js";
import { getCommonWidgetConfig } from "../../configs/webpack/common.js";
import { getPackageConfig } from "../../configs/webpack/buildPackage.js";
import { checkLatestLibsVersion } from "../../utils.js";
import { merge } from "webpack-merge";
import { getModifyManifestWidgetPlugin } from "../../configs/webpack/sections/plugins/modifyManifestWidget.js";
import { getMinimizer } from "../../configs/webpack/sections/plugins/minimizer.js";
import { getZipWidgetPlugin } from "../../configs/webpack/sections/plugins/zipWidget.js";
import chalk from "chalk";

export const runBuild = async (args: BuildOptions) => {
  const mode: Mode = "production";
  const { entry, host, port } = args;

  const isBuildDevMode = !!(host && port);

  const PATHS = generatePaths({
    entryPath: entry,
  });

  const sections = {
    plugins: [getZipWidgetPlugin(isBuildDevMode)] as WebpackPluginInstance[],
  } satisfies Configuration;

  if (isBuildDevMode) {
    sections.plugins.push(
      getModifyManifestWidgetPlugin({
        host,
        port,
      })
    );

    // не нужно собирать все приложение, можно только собрать манифест
    (sections as Configuration).entry = PATHS.manifestJson;
  }

  const configSections = [
    getCommonWidgetConfig(mode, PATHS),
    sections,
    getMinimizer(),
  ] as const;

  const widgetConfig = merge(configSections);

  try {
    await build(widgetConfig as Configuration);
    console.log("");
    await build(await getPackageConfig(mode, PATHS, isBuildDevMode));

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
          })
        );

      res();
    });
  });
}
