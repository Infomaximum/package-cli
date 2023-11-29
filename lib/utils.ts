import type { WriteFileOptions } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import { spawn, type SpawnOptions } from "node:child_process";
import Module from "node:module";

export const systemRequire = Module.createRequire(import.meta.url);

export function capitalizeFirstLetter(str: string = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function writeFile(
  pathToFile: string,
  contents: any,
  options: WriteFileOptions
) {
  await fs.mkdir(path.dirname(pathToFile), { recursive: true });

  await fs.writeFile(pathToFile, contents, options);
}

export function getLatestVersionOfLibrary(libraryName: string) {
  return new Promise<string>((resolve, reject) => {
    https
      .get(
        `https://registry.npmjs.org/-/package/${libraryName}/dist-tags`,
        (res) => {
          if (res.statusCode === 200) {
            let body = "";
            res.on("data", (data) => (body += data));
            res.on("end", () => {
              resolve(JSON.parse(body).latest);
            });
          } else {
            reject();
          }
        }
      )
      .on("error", () => {
        reject();
      });
  });
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
