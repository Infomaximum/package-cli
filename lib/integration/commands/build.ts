import type { Command } from "commander";
import { runBuildIntegration } from "../scripts/build.js";
import {
  registerPackageOptions,
  type InputPackageOptions,
} from "../../package/commands.js";

export type InputBuildIntegrationOptions = {
  entry: string;
  buildDir: string;
  type: BuildType;
  watch: boolean;
  copy: boolean;
} & InputPackageOptions;

export type BuildType = "package" | "script";

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
    .option(
      "--type <buildType>",
      "тип сборки, <package> - сборка пакета (в архив), <script> - сборка в js файл",
      "package"
    )
    .option("--watch", "при изменении файлов скрипт будет пересобран", false)
    .option("--copy", "копирование скрипта интеграции в буфер обмена", false)
    .action((options: InputBuildIntegrationOptions) =>
      runBuildIntegration(options)
    );
};
