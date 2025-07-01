import { type Configuration } from "webpack";
import { type Mode } from "../../paths.js";
import { merge } from "webpack-merge";
import chalk from "chalk";
import { getCommonWidgetConfig } from "../configs/webpack/common.js";
import { getMinimizer } from "../configs/webpack/sections/plugins/minimizer.js";
import { generateWidgetPaths } from "../widgetPaths.js";
import { runWebpackBuild, systemRequire } from "../../utils.js";
import type { MergedBuildScriptOptions } from "../commands/build_script.js";
import { WIDGET_OUTPUT_FULL_FILE_NAME } from "../const.js";
import type { WidgetRCConfig } from "../configs/file.js";
import { getStyleLoaders } from "../configs/webpack/sections/loaders/cssLoaders.js";
import type { IWidgetManifest } from "@infomaximum/widget-sdk";

export const runBuildScript = async (
  args: MergedBuildScriptOptions,
  config: WidgetRCConfig | undefined
) => {
  const mode: Mode = "production";

  const WIDGET_PATHS = generateWidgetPaths(args);

  const widgetManifest = systemRequire(
    WIDGET_PATHS.widgetManifestJsonPath
  ) as IWidgetManifest;

  const sections = {
    entry: WIDGET_PATHS.moduleIndex,
    output: {
      filename: WIDGET_OUTPUT_FULL_FILE_NAME,
    },
  } satisfies Configuration;

  const configSections = [
    getCommonWidgetConfig({
      mode,
      PATHS: WIDGET_PATHS,
      isCopyResources: false,
    }),
    {
      externals: config?.externalsLib ?? {},
      externalsType: "window",
    },
    sections,
    getStyleLoaders({ mode, uuidWidget: widgetManifest.uuid }),
    getMinimizer(),
  ] satisfies Configuration[];

  const widgetConfig = merge(configSections);

  try {
    await runWebpackBuild(widgetConfig as Configuration);
  } catch (error: any) {
    console.error(chalk.red("\nFailed to compile.\n"));
    console.error(chalk.red(error));
    process.exit(1);
  }
};
