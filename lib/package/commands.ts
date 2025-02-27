import type { Command } from "commander";

export type InputPackageOptions = {
  packageManifest: string;
  packageDir: string;
};

export function registerPackageOptions(command: Command) {
  command
    .option(
      "--package-dir <packageDirPath>",
      "путь до директории с файлами пакета",
      "package"
    )
    .option(
      "--package-manifest <manifestPath>",
      "путь до файла манифеста пакета",
      "package/manifest.json"
    );
}
