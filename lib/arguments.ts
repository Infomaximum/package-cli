import packageJson from "../package.json";
import type commander from "commander";
import { runBuild } from "./scripts/build";
import { runDevServer } from "./scripts/start";

export type BuildOptions = {
  entry: string;
};

export type StartOptions = {
  entry: string;
  port: string;
  host: string;
};

export const registerCommands = (cli: commander.Command) => {
  cli.helpOption("-h", "Отображает помощь по командам");
  cli.name("im-package-cli");
  cli.version(
    packageJson.version,
    "-v, --version",
    "Текущая версия библиотеки"
  );

  const widgetCommand = cli.command("widget");

  const widgetBuildCommand = widgetCommand.command("build");

  widgetBuildCommand
    .option("-e, --entrypoint <path>", "Путь до entrypoint")
    .description("Запускает сборку проекта")
    .action((options: BuildOptions) => runBuild(options));

  const widgetStartCommand = widgetCommand.command("start");

  widgetStartCommand
    .description("Запускает проект в dev режиме")
    .option("-e, --entrypoint <path>", "Путь до entrypoint")
    .option(
      "-p, --port <port>",
      "Порт на котором будет доступен виджет",
      "5555"
    )
    .option("--host <host>", "host на котором будет доступен виджет", "0.0.0.0")
    .action((options: StartOptions) => runDevServer(options));
};
