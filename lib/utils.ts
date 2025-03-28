import type { WriteFileOptions } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn, type SpawnOptions, exec } from "node:child_process";
import util from "node:util";
import Module from "node:module";
import { MANIFEST_SERVICE_FIELDS_FOR_DEVELOPMENT } from "./const.js";
import webpack, {
  type Configuration,
  type MultiStats,
  type Stats,
} from "webpack";

const execPromise = util.promisify(exec);

/** Проверка на то, что папка или файл существуют */
export const isExist = async (entityPath: string) => {
  try {
    await fs.access(entityPath);
    return true;
  } catch (error) {
    return false;
  }
};

type Dependency = {
  version: string;
};

export const systemRequire = Module.createRequire(import.meta.url);

export const packageJson = systemRequire("../package.json");

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

export async function getLatestVersionOfLibrary(
  libraryName: string
): Promise<string> {
  const { stdout } = await execPromise(
    `npm show -j -p ${libraryName} version`,
    {
      timeout: 10000,
    }
  );

  return JSON.parse(stdout);
}

export async function getLibraryVersionInProject(libraryName: string): Promise<{
  dependencies?: Record<string, Dependency>;
  devDependencies?: Record<string, Dependency>;
}> {
  const { stdout } = await execPromise(`npm ls -j -p ${libraryName} version`, {
    timeout: 5000,
  });

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

export function removeServiceFieldsForDevelopment(obj: Record<string, any>) {
  MANIFEST_SERVICE_FIELDS_FOR_DEVELOPMENT.forEach((key) => {
    delete obj[key];
  });
}

export const compact = <T>(items: (T | null | undefined | false | "" | 0)[]) =>
  items.filter(Boolean) as T[];

export function runWebpackBuild(config: Configuration) {
  const compiler = webpack(config);

  return new Promise<void>((res, rej) => {
    compiler.run((err: any, stats) =>
      handleWebpackCallback(err, stats, res, rej)
    );
  });
}

export function handleWebpackCallback(
  err?: any | null,
  stats?: Stats,
  okCb?: () => void,
  errCb?: () => void
) {
  if (err) {
    console.error(err.stack || err);

    if (err?.details) {
      console.error(err.details);
    }

    errCb?.();

    return;
  }

  stats &&
    console.log(
      stats.toString({
        chunks: false,
        colors: true,
      })
    );

  okCb?.();
}
