import type { Configuration } from "webpack";
import { runWebpackBuild } from "../../utils.js";
import type { InputBuildIntegrationOptions } from "../commands/build.js";
import { getCommonIntegrationConfig } from "../configs/webpack/common.js";
import { generateIntegrationPaths } from "../integrationPaths.js";
import chalk from "chalk";
import { getPackageBuildConfig } from "../../package/configs/webpack/buildPackage.js";
import path from "path";

export const runBuildIntegration = async (
  options: InputBuildIntegrationOptions
) => {
  const { entry, buildDir, packageDir, packageManifest, type } = options;

  const INTEGRATION_PATHS = generateIntegrationPaths({
    entry,
    buildDir,
    packageDir,
    packageManifest,
  });

  const mode = "production";

  const config = getCommonIntegrationConfig(mode, INTEGRATION_PATHS);

  const integrationScriptPath = path.resolve(
    INTEGRATION_PATHS.appBuildPath,
    INTEGRATION_PATHS.outputFile
  );

  try {
    await runWebpackBuild(config as Configuration);

    type === "package" &&
      (await runWebpackBuild(
        await getPackageBuildConfig({
          mode,
          PATHS: INTEGRATION_PATHS,
          isBuildDevMode: false,
          entityArchivePath: integrationScriptPath,
          copyFiles: [{ from: integrationScriptPath }],
        })
      ));
  } catch (error: any) {
    console.error(chalk.red("\nFailed to compile.\n"));
    console.error(chalk.red(error));
    process.exit(1);
  }
};
