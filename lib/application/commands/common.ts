import chalk from "chalk";
import { assertSimple } from "@infomaximum/assert";
import { DEFAULT_BUILD_DIR_NAME } from "../../const.js";
import type { ApplicationRCConfig } from "../configs/file.js";
import type { Command } from "commander";
import {
  registerPackageOptions,
  type InputPackageOptions,
} from "../../package/commands.js";
import path from "path";

export type InputApplicationCommonOptions = {
  entry: string;
  applicationManifest?: string;
  applicationIcon?: string;
} & InputPackageOptions;

export type MergedApplicationCommonOptions = ReturnType<
  typeof mergeApplicationConfigWithOptionsCommon
>;

export function registerApplicationCommonOption(command: Command) {
  registerPackageOptions(command);

  command
    .option("--entry <path>", "путь до entrypoint")
    .option(
      "--application-manifest <manifestPath>",
      "путь до файла манифеста приложения",
    )
    .option(
      "--application-icon <applicationIconPath>",
      "путь до файла с иконкой (.png или .svg)",
    );
}

export function mergeApplicationConfigWithOptionsCommon(
  config: ApplicationRCConfig | undefined,
  options: InputApplicationCommonOptions,
) {
  const entry = options.entry || config?.entry;
  const packageDir = options?.packageDir || config?.packageDir;
  const buildDir = config?.buildDir || DEFAULT_BUILD_DIR_NAME;
  const packageManifest = options?.packageManifest || config?.packageManifest;
  const applicationManifest =
    options?.applicationManifest || config?.applicationManifest;
  const applicationIcon = options?.applicationIcon || config?.applicationIcon;

  if (typeof applicationIcon === "string") {
    const [_, ext] = path.basename(applicationIcon).split(".");

    assertSimple(
      ext === "svg" || ext === "png",
      chalk.red("Неверный формат иконки. Должен быть .svg или .png"),
    );
  }

  assertSimple(!!entry, chalk.red("В конфигурации не задан entry"));
  assertSimple(!!packageDir, chalk.red("В конфигурации не задан packageDir"));
  assertSimple(
    !!packageManifest,
    chalk.red("В конфигурации не задан packageManifest"),
  );
  assertSimple(
    !!applicationManifest,
    chalk.red("В конфигурации не задан applicationManifest"),
  );

  return {
    entry,
    packageDir,
    packageManifest,
    applicationManifest,
    buildDir,
    applicationIcon,
  };
}
