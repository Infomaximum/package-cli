import type { Command } from "commander";
import { getApplicationConfigFromFile } from "../configs/file.js";
import {
  mergeApplicationConfigWithOptionsCommon,
  registerApplicationCommonOption,
  type InputApplicationCommonOptions,
} from "./common.js";
import { runApplicationBuild } from "../scripts/build.js";

export type InputBuildOptions = {
  dev: boolean;
  port?: string | number;
  host?: string;
  buildDir?: string;
} & InputApplicationCommonOptions;

export type MergedApplicationBuildOptions = ReturnType<
  typeof mergeApplicationWithOptionsBuild
>;

function mergeApplicationWithOptionsBuild(options: InputBuildOptions) {
  const config = getApplicationConfigFromFile();

  return {
    host: options.host || config?.host,
    port: options.port || config?.port,
    dev: options.dev,
    ...mergeApplicationConfigWithOptionsCommon(config, options),
  };
}

export const registerApplicationBuildCommand = (
  applicationCommand: Command
) => {
  const applicationBuildCommand = applicationCommand.command("build");

  registerApplicationCommonOption(applicationBuildCommand);

  applicationBuildCommand
    .description("Выполняет сборку пакета")
    .option(
      "--build-dir <buildDirPath>",
      "путь до директории в которую будет собран пакет"
    )
    .option("--dev", "собрать пакет для разработки", false)
    .option("--host <host>", "хост который будет указан в манифесте приложения")
    .option("--port <port>", "порт который будет указан в манифесте приложения")
    .action((options: InputBuildOptions) =>
      runApplicationBuild(mergeApplicationWithOptionsBuild(options))
    );
};
