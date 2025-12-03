import chalk from "chalk";
import { assertSilent } from "@infomaximum/assert";
import { getApplicationConfigFromFile } from "../configs/file.js";
import {
  mergeApplicationConfigWithOptionsCommon,
  registerApplicationCommonOption,
  type InputApplicationCommonOptions,
} from "./common.js";
import {
  APPLICATION_DEFAULT_HOST,
  APPLICATION_DEFAULT_PORT,
} from "../const.js";
import { runApplicationDevServer } from "../scripts/start.js";
import type { Command } from "commander";

export type InputApplicationStartOptions = {
  port: string | number;
  host: string;
} & InputApplicationCommonOptions;

export type MergedApplicationStartOptions = ReturnType<
  typeof configMergeWithOptionsStart
>;

function configMergeWithOptionsStart(options: InputApplicationStartOptions) {
  const config = getApplicationConfigFromFile();

  const host = options.host || config?.host;
  const port = options.port || config?.port;

  assertSilent(
    !!host,
    chalk.yellow(
      `В конфигурациях не найден host, используется host по умолчанию "${APPLICATION_DEFAULT_HOST}"`
    )
  );

  assertSilent(
    !!port,
    chalk.yellow(
      `В конфигурациях не найден port, используется port по умолчанию "${APPLICATION_DEFAULT_PORT}"`
    )
  );

  return {
    host: host || APPLICATION_DEFAULT_HOST,
    port: port || APPLICATION_DEFAULT_PORT,
    ...mergeApplicationConfigWithOptionsCommon(config, options),
  };
}

export const registerApplicationStartCommand = (
  applicationCommand: Command
) => {
  const applicationStartCommand = applicationCommand.command("start");

  registerApplicationCommonOption(applicationStartCommand);

  applicationStartCommand
    .description("Выполняет запуск проекта для разработки")
    .option("--port <port>", "порт на котором будет доступно приложение")
    .option("--host <host>", "host на котором будет доступно приложение")
    .action((options: InputApplicationStartOptions) =>
      runApplicationDevServer(configMergeWithOptionsStart(options))
    );
};
