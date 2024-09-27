import fs from "fs-extra";
import path from "path";
import semver from "semver";
import standardVersion, { type Options } from "standard-version";
import stringifyPackage from "stringify-package";
import { number } from "@inquirer/prompts";
import { generateGlobalPaths, type GlobalPaths } from "../../../paths.js";
import { getConfigFromFile } from "../../configs/file.js";
import { DEFAULT_BUILD_DIR_NAME } from "../../../const.js";
import { isExist } from "../../../utils.js";
import type {
  InputReleaseOptions,
  MergedReleaseOptions,
} from "../../commands/release.js";
import { getWidgetManifestPath } from "../../widgetPaths.js";
import {
  getJsonContentFile,
  getRecommendedReleaseType,
  validateSystemVersion,
} from "./utils.js";
import { MIN_SYSTEM_VERSION_MANIFEST_FIELD_NAME } from "./const.js";

const getSkipOptions = ({ changelog }: InputReleaseOptions): Options.Skip => {
  if (changelog) {
    return {
      changelog: false,
      bump: true,
      commit: true,
      tag: true,
    };
  }

  return {
    changelog: false,
    bump: false,
    commit: false,
    tag: false,
  };
};

const getBumpFiles = (manifestWidgetPath: string): Options.VersionFile[] => {
  const readVersionPackageJson: Options.Updater["readVersion"] = (contents) =>
    JSON.parse(contents).version;

  const readVersionManifest: Options.Updater["readVersion"] = (contents) =>
    JSON.parse(contents)?.[MIN_SYSTEM_VERSION_MANIFEST_FIELD_NAME];

  const writeVersionPackageJson: Options.Updater["writeVersion"] = (
    contents,
    version
  ) => {
    const { json, indent, newline } = getJsonContentFile(contents);

    json.version = version;

    return stringifyPackage(json, indent, newline);
  };

  const writeVersionManifest: Options.Updater["writeVersion"] = (
    contents,
    version
  ) => {
    const { json, indent, newline } = getJsonContentFile(contents);

    json[MIN_SYSTEM_VERSION_MANIFEST_FIELD_NAME] = String(
      semver.major(version)
    );

    return stringifyPackage(json, indent, newline);
  };

  return [
    {
      filename: "package.json",
      //@ts-expect-error fix ошибки внутри библиотеки связанной с валидацией
      readVersion: readVersionPackageJson,
      writeVersion: writeVersionPackageJson,
      updater: {
        readVersion: readVersionPackageJson,
        writeVersion: writeVersionPackageJson,
      },
    },

    {
      filename: manifestWidgetPath,
      //@ts-expect-error fix ошибки внутри библиотеки связанной с валидацией
      readVersion: readVersionManifest,
      writeVersion: writeVersionManifest,
      updater: {
        readVersion: readVersionManifest,
        writeVersion: writeVersionManifest,
      },
    },
  ];
};

type TVersionOnReleaseParams = {
  globalPaths: GlobalPaths;
  manifestWidgetPath: string;
};

const getVersionOnRelease = async ({
  globalPaths,
  manifestWidgetPath,
}: TVersionOnReleaseParams) => {
  const releaseType = await getRecommendedReleaseType(globalPaths.appPath);

  const [packageJsonContent, widgetManifestContent] = await Promise.all([
    fs.readFile(globalPaths.appPackageJson, {
      encoding: "utf-8",
    }),
    fs.readFile(manifestWidgetPath, {
      encoding: "utf-8",
    }),
  ]);

  const packageJSON = JSON.parse(packageJsonContent);
  const currentWidgetVersion: string = packageJSON.version;
  const manifestJSON = JSON.parse(widgetManifestContent);
  const minSystemVersionFromManifest: string | undefined =
    manifestJSON?.[MIN_SYSTEM_VERSION_MANIFEST_FIELD_NAME];

  let newVersion = currentWidgetVersion;

  if (releaseType === "major") {
    const majorWidgetVersion = semver.major(currentWidgetVersion);
    const currentMinSystemVersion =
      minSystemVersionFromManifest && +minSystemVersionFromManifest;

    const isValidVersion =
      typeof currentMinSystemVersion === "number" &&
      !isNaN(currentMinSystemVersion) &&
      currentMinSystemVersion > majorWidgetVersion;

    const minSystemVersion = isValidVersion
      ? currentMinSystemVersion
      : await number({
          message:
            "Введите минимальную версию системы в которой работает виджет (в формате 2409): ",
          validate: validateSystemVersion(majorWidgetVersion),
        });

    const version = `${minSystemVersion}.0.0`;

    if (!semver.valid(version)) {
      throw new Error(`Не валидная версия ${version}`);
    }

    newVersion = version;
  } else {
    newVersion = semver.inc(currentWidgetVersion, releaseType)!;
  }

  return newVersion;
};

export const runReleaseWidget = async (options: MergedReleaseOptions) => {
  const { first, widgetManifest } = options;

  const config = getConfigFromFile();

  const globalPaths = generateGlobalPaths({
    buildDirPath: config?.buildDir ?? DEFAULT_BUILD_DIR_NAME,
  });

  const manifestWidgetPath = getWidgetManifestPath(widgetManifest);

  const changelogFile = path.resolve(globalPaths.appPath, "CHANGELOG.md");

  const isFirstRelease = first || !(await isExist(changelogFile));

  await standardVersion({
    releaseAs: await getVersionOnRelease({ globalPaths, manifestWidgetPath }),
    header: "",
    dryRun: false,
    path: globalPaths.appPath,
    bumpFiles: getBumpFiles(manifestWidgetPath),
    firstRelease: isFirstRelease,
    infile: changelogFile,
    skip: getSkipOptions(options),
    packageFiles: [path.basename(globalPaths.appPackageJson), widgetManifest],
    //@ts-expect-error
    verify: false,
  });
};
