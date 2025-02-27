import path from "path";
import standardVersion, { type Options } from "standard-version";
import stringifyPackage from "stringify-package";
import { generateGlobalPaths } from "../../../paths.js";
import { getConfigFromFile } from "../../configs/file.js";
import { DEFAULT_BUILD_DIR_NAME } from "../../../const.js";
import { isExist } from "../../../utils.js";
import type { InputReleaseOptions } from "../../commands/release.js";
import { getJsonContentFile } from "./utils.js";

const getSkipOptions = ({
  skipChangelog,
  skipBump,
  skipCommit,
  skipTag,
}: InputReleaseOptions): Options.Skip => {
  return {
    changelog: skipChangelog,
    bump: skipBump,
    commit: skipCommit,
    tag: skipTag,
  };
};

const getBumpFiles = (): Options.VersionFile[] => {
  const readVersionPackageJson: Options.Updater["readVersion"] = (contents) =>
    JSON.parse(contents).version;

  const writeVersionPackageJson: Options.Updater["writeVersion"] = (
    contents,
    version
  ) => {
    const { json, indent, newline } = getJsonContentFile(contents);

    json.version = version;

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
  ];
};

export const runReleaseWidget = async (options: InputReleaseOptions) => {
  const { first, dryRun } = options;

  const config = getConfigFromFile();

  const globalPaths = generateGlobalPaths({
    buildDir: config?.buildDir ?? DEFAULT_BUILD_DIR_NAME,
  });

  const changelogFile = path.resolve(globalPaths.appPath, "CHANGELOG.md");

  const isFirstRelease = first || !(await isExist(changelogFile));

  await standardVersion({
    header: "",
    dryRun,
    path: globalPaths.appPath,
    bumpFiles: getBumpFiles(),
    firstRelease: isFirstRelease,
    infile: changelogFile,
    skip: getSkipOptions(options),
    packageFiles: [path.basename(globalPaths.appPackageJson)],
    //@ts-expect-error
    verify: false,
  });
};
