import standardVersion from "standard-version";
import { generateGlobalPaths } from "../../paths.js";
import { getConfigFromFile } from "../configs/file.js";
import { DEFAULT_BUILD_DIR_NAME } from "../../const.js";
import path from "path";
import { isExist } from "../../utils.js";
import type { InputReleaseOptions } from "../commands/release.js";

export const runReleaseWidget = async (options: InputReleaseOptions) => {
  const { first } = options;

  const config = getConfigFromFile();

  const globalPaths = generateGlobalPaths({
    buildDirPath: config?.buildDir ?? DEFAULT_BUILD_DIR_NAME,
  });

  const changelogFile = path.resolve(globalPaths.appPath, "CHANGELOG.md");

  const isFirstRelease = first || !(await isExist(changelogFile));

  await standardVersion({
    infile: changelogFile,
    //@ts-expect-error
    verify: false,
    path: globalPaths.appPath,
    header: "",
    bumpFiles: ["package.json"],
    firstRelease: isFirstRelease,
    skip: {
      commit: true,
      tag: true,
    },
  });
};
