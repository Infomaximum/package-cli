import webpack, { type Configuration } from "webpack";
import type { BuildOptions } from "../../arguments.js";
import { type Mode, generatePaths } from "../../paths.js";
import { getCommonWidgetConfig } from "../../configs/webpack/common.js";
import { getPackageConfig } from "../../configs/webpack/buildPaсkage.js";
import { checkLatestVersion } from "../../utils.js";
import { CUSTOM_WIDGET_LIB_NAME } from "../../const.js";

export const runBuild = async (args: BuildOptions) => {
  const mode: Mode = "production";

  await checkLatestVersion(CUSTOM_WIDGET_LIB_NAME);

  const PATHS = generatePaths({
    entryPath: args.entry,
  });

  const configList = [
    getCommonWidgetConfig(mode, PATHS),
    getPackageConfig(mode, PATHS),
  ] as Configuration[];

  try {
    build(configList);
  } catch (error: any) {
    console.error("Failed to compile.\n");
    console.error(error);
    process.exit(1);
  }
};

function build(config: webpack.Configuration[]) {
  const compiler = webpack(config);

  return compiler.run((err: any, stats) => {
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
  });
}
