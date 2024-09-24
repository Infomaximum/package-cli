import chalk from "chalk";
import { assertSilent } from "@infomaximum/assert";
import { getConfigFromFile } from "../configs/file.js";
import {
  configMergeWithOptionsCommon,
  registerCommonOption,
  type InputCommonOptions,
} from "./common.js";
import { WIDGET_DEFAULT_HOST, WIDGET_DEFAULT_PORT } from "../const.js";
import { runDevServer } from "../scripts/start.js";
import type { Command } from "commander";

export type InputStartOptions = {
  port: string | number;
  host: string;
} & InputCommonOptions;

export type MergedStartOptions = ReturnType<typeof configMergeWithOptionsStart>;

function configMergeWithOptionsStart(options: InputStartOptions) {
  const config = getConfigFromFile();

  const host = options.host || config?.host;
  const port = options.port || config?.port;

  assertSilent(
    !!host,
    chalk.yellow(
      `В конфигурациях не найден host, используется host по умолчанию "${WIDGET_DEFAULT_HOST}"`
    )
  );

  assertSilent(
    !!port,
    chalk.yellow(
      `В конфигурациях не найден port, используется port по умолчанию "${WIDGET_DEFAULT_PORT}"`
    )
  );

  return {
    host: host || WIDGET_DEFAULT_HOST,
    port: port || WIDGET_DEFAULT_PORT,
    ...configMergeWithOptionsCommon(config, options),
  };
}

export const registerWidgetStartCommand = (widgetCommand: Command) => {
  const widgetStartCommand = widgetCommand.command("start");

  registerCommonOption(widgetStartCommand);

  widgetStartCommand
    .description("Выполняет запуск проекта для разработки")
    .option("--port <port>", "порт на котором будет доступен виджет")
    .option("--host <host>", "host на котором будет доступен виджет")
    .action((options: InputStartOptions) =>
      runDevServer(configMergeWithOptionsStart(options))
    );
};
