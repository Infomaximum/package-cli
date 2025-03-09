import webpack, { type Configuration } from "webpack";
import { handleWebpackCallback, runWebpackBuild } from "../../utils.js";
import type { InputBuildIntegrationOptions } from "../commands/build.js";
import { getCommonIntegrationConfig } from "../configs/webpack/common.js";
import { generateIntegrationPaths } from "../integrationPaths.js";
import chalk from "chalk";
import { getPackageBuildConfig } from "../../package/configs/webpack/buildPackage.js";
import path from "path";
import { merge } from "webpack-merge";
import { CopyToClipboardPlugin } from "../configs/webpack/CopyToClipboardPlugin.js";
import type { IntegrationRCConfig } from "../configs/file.js";
import { FetchCodeToServerPlugin } from "../configs/webpack/FetchCodeToServerPlugin.js";

export const runBuildIntegration = async (
  options: InputBuildIntegrationOptions,
  rcConfig: IntegrationRCConfig | undefined
) => {
  const {
    entry,
    buildDir,
    packageDir,
    packageManifest,
    type,
    watch,
    copy,
    beautify: isBeautifyCode,
  } = options;

  const INTEGRATION_PATHS = generateIntegrationPaths({
    entry,
    buildDir,
    packageDir,
    packageManifest,
  });

  const mode = "production";

  const commonConfig = getCommonIntegrationConfig({
    mode,
    isBeautifyCode,
    PATHS: INTEGRATION_PATHS,
  });

  const fetcherFromConfig = rcConfig?.fetcher;

  const config = merge([
    commonConfig,
    watch && {
      watch: true,
    },

    {
      plugins: [
        copy && new CopyToClipboardPlugin(),

        options.fetchToServer &&
          typeof fetcherFromConfig === "function" &&
          new FetchCodeToServerPlugin({
            fetcher: fetcherFromConfig,
          }),
      ],
    },
  ]);

  const integrationScriptPath = path.resolve(
    INTEGRATION_PATHS.appBuildPath,
    INTEGRATION_PATHS.outputFile
  );

  if (watch) {
    webpack(config, (err, stats) => handleWebpackCallback(err, stats));

    return;
  }

  try {
    await runWebpackBuild(config as Configuration);

    if (type === "package" && !watch) {
      await runWebpackBuild(
        await getPackageBuildConfig({
          mode,
          PATHS: INTEGRATION_PATHS,
          isBuildDevMode: false,
          entityArchivePath: integrationScriptPath,
          copyFiles: [{ from: integrationScriptPath }],
        })
      );
    }
  } catch (error: any) {
    console.error(chalk.red("\nFailed to compile.\n"));
    console.error(chalk.red(error));
    process.exit(1);
  }
};
