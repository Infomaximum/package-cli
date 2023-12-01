import type { Command } from "commander";
import { runBuild } from "./scripts/widget/build.js";
import { runDevServer } from "./scripts/widget/start.js";
import { runInitWidget } from "./scripts/widget/init/init.js";
import { systemRequire } from "./utils.js";
import { DEFAULT_HOST, DEFAULT_PORT } from "./const.js";

const packageJson = systemRequire("../package.json");

export type BuildOptions = {
  entry: string;
  port?: string;
  host?: string;
};

export type StartOptions = {
  entry: string;
  port: string;
  host: string;
};

const registerWidgetCommands = (cli: Command) => {
  const widgetCommand = cli.command("widget");

  const widgetBuildCommand = widgetCommand.command("build");

  widgetBuildCommand
    .description("Выполняет сборку пакета для дальнейшей загрузки в систему")
    .option("-e, --entry <path>", "Путь до entrypoint")
    .option(
      "-p, --port <port>",
      "Порт который будет указан в манифесте виджета"
    )
    .option("--host <host>", "host который будет указан в манифесте виджета")
    .description("Запускает сборку проекта")
    .action((options: BuildOptions) => runBuild(options));

  const widgetStartCommand = widgetCommand.command("start");

  widgetStartCommand
    .description("Выполняет запуск проекта для разработки")
    .option("-e, --entry <path>", "Путь до entrypoint")
    .option(
      "-p, --port <port>",
      "Порт на котором будет доступен виджет",
      DEFAULT_PORT
    )
    .option(
      "--host <host>",
      "host на котором будет доступен виджет",
      DEFAULT_HOST
    )
    .action((options: StartOptions) => runDevServer(options));

  const widgetInitCommand = widgetCommand.command("init <project-directory>");

  widgetInitCommand
    .description("Создание виджета")
    .action((dirName: string) => {
      runInitWidget(dirName);
    });
};

export const registerCommands = (cli: Command) => {
  cli.helpOption("-h", "Отображает помощь по командам");
  cli.name("im-package-cli");
  cli.version(
    packageJson.version,
    "-v, --version",
    "Текущая версия библиотеки"
  );

  registerWidgetCommands(cli);
};
