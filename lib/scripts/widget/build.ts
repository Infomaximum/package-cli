import webpack, {
  type Configuration,
  type WebpackPluginInstance,
} from "webpack";
import type { BuildOptions } from "../../arguments.js";
import { type Mode, generatePaths } from "../../paths.js";
import { getCommonWidgetConfig } from "../../configs/webpack/common.js";
import { getPackageConfig } from "../../configs/webpack/buildPaсkage.js";
import { checkLatestLibsVersion } from "../../utils.js";
import { merge } from "webpack-merge";
import { getModifyManifestWidgetPlugin } from "../../configs/webpack/sections/plugins/modifyManifestWidget.js";
import { getMinimizer } from "../../configs/webpack/sections/plugins/minimizer.js";
import { getZipWidgetPlugin } from "../../configs/webpack/sections/plugins/zipWidget.js";

export const runBuild = async (args: BuildOptions) => {
  const mode: Mode = "production";
  const { entry, host, port } = args;

  const PATHS = generatePaths({
    entryPath: entry,
  });

  const pluginsSection = {
    plugins: [getZipWidgetPlugin()] as WebpackPluginInstance[],
  } satisfies Configuration;

  if (host && port) {
    pluginsSection.plugins.push(
      getModifyManifestWidgetPlugin({
        host,
        port,
      })
    );
  }

  const configSections = [
    getCommonWidgetConfig(mode, PATHS),
    pluginsSection,
    getMinimizer(),
  ] as const;

  const widgetConfig = merge(configSections);

  const configs = [
    widgetConfig,
    getPackageConfig(mode, PATHS),
  ] as Configuration[];

  try {
    build(configs);
  } catch (error: any) {
    console.error("Failed to compile.\n");
    console.error(error);
    process.exit(1);
  }
};

function build(config: webpack.Configuration[]) {
  const compiler = webpack(config);

  return compiler.run(async (err: any, stats) => {
    if (err) {
      console.error(err.stack || err);

      if (err?.details) {
        console.error(err.details);
      }

      return;
    }

    stats &&
      console.log(
        stats?.toString({
          chunks: false,
          colors: true,
        })
      );

    await checkLatestLibsVersion();
  });
}
