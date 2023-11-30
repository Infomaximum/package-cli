import type { WriteFileOptions } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn, type SpawnOptions, exec } from "node:child_process";
import util from "node:util";
import Module from "node:module";
import semver from "semver";
import chalk from "chalk";
import {
  CUSTOM_PACKAGE_CLI_LIB_NAME,
  CUSTOM_WIDGET_LIB_NAME,
} from "./const.js";

const execPromise = util.promisify(exec);

export const systemRequire = Module.createRequire(import.meta.url);

export function capitalizeFirstLetter(str: string = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function safeWriteFile(
  pathToFile: string,
  contents: any,
  options: WriteFileOptions
) {
  await fs.mkdir(path.dirname(pathToFile), { recursive: true });

  await fs.writeFile(pathToFile, contents, options);
}

export async function getLatestVersionOfLibrary(libraryName: string) {
  const { stdout } = await execPromise(`npm show -j -p ${libraryName} version`);

  return JSON.parse(stdout);
}

export async function getLibraryVersionInProject(libraryName: string) {
  const { stdout } = await execPromise(`npm ls -j -p ${libraryName} version`);

  return JSON.parse(stdout);
}

export function spawnCommand(
  command: string,
  args: ReadonlyArray<string>,
  options: SpawnOptions
) {
  const didSucceed = (code: number | null) => `${code}` === "0";

  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(command, args, {
      shell: true,
      stdio: "inherit",
      ...options,
    });

    childProcess.on("close", (code) => {
      if (didSucceed(code)) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
}

export async function checkLatestVersion(libName: string) {
  const libVersionInProject = await getLibraryVersionInProject(libName);

  const libVersionFromProject: string | undefined = (
    libVersionInProject?.dependencies?.[libName] ||
    libVersionInProject?.devDependencies?.[libName]
  )?.version;

  if (!libVersionFromProject) return;

  const latestVersion = await getLatestVersionOfLibrary(libName);

  const isOldVersion = semver.gt(latestVersion, libVersionFromProject);

  if (isOldVersion) {
    console.error(
      chalk.yellow(
        `\n\nA new version of the ${chalk.underline(
          `${libName}@${latestVersion}`
        )} library has been released,\n` +
          `old version ${libVersionFromProject} is used in the project, it is recommended to ` +
          `update to the latest version \n` +
          chalk.green.bold(
            chalk.underline(`npm i --save ${libName}@${latestVersion}`) +
              " or " +
              chalk.underline(`yarn upgrade ${libName}@${latestVersion}\n\n`)
          )
      )
    );
  }
}

export async function checkLatestLibsVersion() {
  await checkLatestVersion(CUSTOM_WIDGET_LIB_NAME);
  await checkLatestVersion(CUSTOM_PACKAGE_CLI_LIB_NAME);
}
