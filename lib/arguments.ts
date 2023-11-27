import type { Command } from "commander";
import { runBuild } from "./scripts/widget/build.js";
import { runDevServer } from "./scripts/widget/start.js";
import { runInit } from "./scripts/widget/init/init.js";

export type BuildOptions = {
  entry: string;
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
    .option("-e, --entry <path>", "Путь до entrypoint")
    .description("Запускает сборку проекта")
    .action((options: BuildOptions) => runBuild(options));

  const widgetStartCommand = widgetCommand.command("start");

  widgetStartCommand
    .description("Запускает проект в dev режиме")
    .option("-e, --entry <path>", "Путь до entrypoint")
    .option(
      "-p, --port <port>",
      "Порт на котором будет доступен виджет",
      "5555"
    )
    .option("--host <host>", "host на котором будет доступен виджет", "0.0.0.0")
    .action((options: StartOptions) => runDevServer(options));

  const widgetInitCommand = widgetCommand.command("init <path>");

  widgetInitCommand
    .description("Создание виджета")
    .action((initPath: string) => {
      runInit(initPath);
    });
};

export const registerCommands = (cli: Command) => {
  cli.helpOption("-h", "Отображает помощь по командам");
  cli.name("im-package-cli");

  registerWidgetCommands(cli);
};
