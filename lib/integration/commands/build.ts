import type { Command } from "commander";
import { runBuildIntegration } from "../scripts/build.js";
import {
  registerPackageOptions,
  type InputPackageOptions,
} from "../../package/commands.js";
import { getConfigIntegrationFromFile } from "../configs/file.js";
import {
  INTEGRATION_CONFIG_RC_EXT,
  INTEGRATION_CONFIG_RC_FILE_NAME,
} from "../const.js";

export type InputBuildIntegrationOptions = {
  entry: string;
  buildDir: string;
  type: BuildType;
  watch: boolean;
  copy: boolean;
  fetchToServer: boolean;
  beautify: boolean;
} & InputPackageOptions;

export type BuildType = "package" | "script";

export const registerIntegrationBuildCommand = (
  integrationCommand: Command
) => {
  const integrationBuildCommand = integrationCommand.command("build");

  registerPackageOptions(integrationBuildCommand);

  const config = getConfigIntegrationFromFile();

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
    .option(
      "--fetchToServer",
      `отправка изменений на сервер (должен быть настроен файл ${INTEGRATION_CONFIG_RC_FILE_NAME}${INTEGRATION_CONFIG_RC_EXT})`,
      false
    )
    .option("--beautify", `отформатировать код после сборки`, false)
    .action((options: InputBuildIntegrationOptions) => {
      if (options.fetchToServer && typeof config?.fetcher !== "function") {
        throw new Error("Не настроен конфиг или нет функции fetcher в конфиге");
      }

      runBuildIntegration(options, config);
    });
};
