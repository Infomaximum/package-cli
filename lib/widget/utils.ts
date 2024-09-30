import semver from "semver";
import chalk from "chalk";
import {
  getLatestVersionOfLibrary,
  getLibraryVersionInProject,
  systemRequire,
} from "../utils.js";
import { WIDGET_SDK_LIB_NAME } from "./const.js";
import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../const.js";

export async function checkLatestVersion(libName: string) {
  const libVersionInProject = await getLibraryVersionInProject(libName);

  if (!libVersionInProject) return;

  const libVersionFromProject: string | undefined = (
    libVersionInProject?.dependencies?.[libName] ||
    libVersionInProject?.devDependencies?.[libName]
  )?.version;

  if (!libVersionFromProject) return;

  const latestVersion = await getLatestVersionOfLibrary(libName);

  if (!latestVersion) return;

  const isOldVersion = semver.gt(latestVersion, libVersionFromProject);

  if (isOldVersion) {
    console.error(
      chalk.yellow(
        `\n\nA new version of the ${chalk.underline(
          `${libName}@${latestVersion}`,
        )} library has been released,\n` +
          `old version ${libVersionFromProject} is used in the project, it is recommended to ` +
          `update to the latest version \n` +
          chalk.green.bold(
            chalk.underline(`npm i --save ${libName}@${latestVersion}`) +
              " or " +
              chalk.underline(`yarn upgrade ${libName}@${latestVersion}\n\n`),
          ),
      ),
    );
  }
}

export async function checkLatestLibsVersion() {
  try {
    await Promise.allSettled([
      checkLatestVersion(WIDGET_SDK_LIB_NAME),
      checkLatestVersion(CUSTOM_PACKAGE_CLI_LIB_NAME),
    ]);
  } catch (error) {}
}

export function getSdkVersionFromPackageJson(
  appPackageJsonPath: string,
): number {
  const packageJson = systemRequire(appPackageJsonPath);

  let version: number = 0;

  for (const field of ["dependencies", "devDependencies"]) {
    const tempVersion = packageJson?.[field]?.[WIDGET_SDK_LIB_NAME] as
      | string
      | undefined;

    if (tempVersion && semver.valid(tempVersion)) {
      version = semver.major(tempVersion);
      break;
    }

    if (tempVersion && semver.validRange(tempVersion)) {
      version = semver.major(semver.minVersion(tempVersion) || "0.0.0");
      break;
    }
  }

  return version;
}
