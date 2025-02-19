import type { Command } from "commander";
import { runBuildIntegration } from "../scripts/build.js";
import {
  registerPackageOptions,
  type InputPackageOptions,
} from "../../package/commands.js";

export type InputBuildIntegrationOptions = {
  entry: string;
  buildDir: string;
} & InputPackageOptions;

export const registerIntegrationBuildCommand = (
  integrationCommand: Command
) => {
  const integrationBuildCommand = integrationCommand.command("build");

  registerPackageOptions(integrationBuildCommand);

  integrationBuildCommand
    .description("Выполняет сборку пакета c интеграцией")
    .option("--entry <path>", "путь до entrypoint", "src/index.ts")
    .option(
      "--build-dir <buildDirPath>",
      "путь до директории в которую будет собран пакет",
      "build"
    )
    .action((options: InputBuildIntegrationOptions) =>
      runBuildIntegration(options)
    );
};
