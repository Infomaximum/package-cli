import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import * as tar from "tar";
import { isExist } from "../utils.js";

type DownloadedNpmPackage = {
  rootDir: string;
  cleanup: () => Promise<void>;
};

type NpmPackJsonItem = {
  filename: string;
};

export async function downloadNpmPackageToTempDir(
  spec: string
): Promise<DownloadedNpmPackage> {
  const tempRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "im-package-cli-template-")
  );

  try {
    const packStdout = await spawnCollect("npm", ["pack", "--json", spec], {
      cwd: tempRoot,
    });

    const items = JSON.parse(packStdout) as NpmPackJsonItem[];
    const filename = items[0]?.filename;

    if (!filename) {
      throw new Error(`npm pack did not return filename (spec: ${spec})`);
    }

    const tarballPath = path.join(tempRoot, filename);
    const unpackDir = path.join(tempRoot, "unpacked");

    await fs.mkdir(unpackDir, { recursive: true });
    await tar.x({ file: tarballPath, cwd: unpackDir });

    const rootDir = path.join(unpackDir, "package");

    if (!(await isExist(rootDir))) {
      throw new Error(
        `npm pack archive does not contain 'package/' dir (spec: ${spec})`
      );
    }

    return {
      rootDir,
      cleanup: async () => {
        await fs.rm(tempRoot, { recursive: true, force: true });
      },
    };
  } catch (error) {
    await fs.rm(tempRoot, { recursive: true, force: true });
    throw error;
  }
}

type SpawnCollectOptions = {
  cwd: string;
};

function spawnCollect(
  command: string,
  args: string[],
  { cwd }: SpawnCollectOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const stdoutChunks: Uint8Array[] = [];
    const stderrChunks: Uint8Array[] = [];

    child.stdout.on("data", (d) => stdoutChunks.push(d));
    child.stderr.on("data", (d) => stderrChunks.push(d));

    child.on("error", reject);
    child.on("close", (code) => {
      const stdout = Buffer.concat(stdoutChunks).toString("utf8").trim();

      if (code === 0) {
        resolve(stdout);
        return;
      }

      const stderr = Buffer.concat(stderrChunks).toString("utf8").trim();
      reject(
        new Error(
          `${command} ${args.join(" ")} exited with code ${code}\n${stderr}`
        )
      );
    });
  });
}
