import path from "node:path";
import fs from "node:fs/promises";
import nodePlop from "node-plop";
import { addCommonHelpers } from "../plopHelpers.js";
import { prompts, type Answers } from "../package/scripts/prompts.js";
import { isExist, packageJson, spawnCommand } from "../utils.js";
import type { TemplateSource } from "./templateSource.js";
import { downloadNpmPackageToTempDir } from "./downloadNpmPackageToTempDir.js";
import { resolveTemplatePackFromDir } from "./resolveTemplatePackFromDir.js";
import { generateFromTemplatePack } from "./generateFromTemplatePack.js";

type RunInitFromTemplateSourceParams = {
  dirName: string;
  template: Exclude<TemplateSource, { type: "inline" }>;
};

export async function runInitFromTemplateSource({
  dirName,
  template,
}: RunInitFromTemplateSourceParams) {
  const createPath = path.join(process.cwd(), dirName);

  await ensureEmptyDir(createPath);

  const answers = await runPrompts();
  const context = {
    ...answers,
    packageCliVersion: String(packageJson.version ?? ""),
  };

  if (template.type === "dir") {
    const pack = await resolveTemplatePackFromDir(template.dirPath);
    await generateFromTemplatePack({
      templatePack: pack,
      targetDir: createPath,
      context,
    });
  } else {
    const downloaded = await downloadNpmPackageToTempDir(template.spec);
    try {
      const pack = await resolveTemplatePackFromDir(downloaded.rootDir);
      await generateFromTemplatePack({
        templatePack: pack,
        targetDir: createPath,
        context,
      });
    } finally {
      await downloaded.cleanup();
    }
  }

  try {
    await spawnCommand(answers.packageManager, ["install"], {
      cwd: createPath,
    });
  } catch (error) {
    console.error(error);
  }

  try {
    await spawnCommand("git", ["init", "-b", "develop"], {
      cwd: createPath,
    });
  } catch (error) {
    console.error(error);
  }
}

async function runPrompts(): Promise<Answers> {
  const plop = await nodePlop(undefined, {
    destBasePath: process.cwd(),
    force: false,
  });

  addCommonHelpers(plop);

  const generatorName = "template-pack-prompts";
  plop.setGenerator(generatorName, {
    prompts,
    actions: [],
  });

  const generator = plop.getGenerator(generatorName);
  return (await generator.runPrompts()) as Answers;
}

async function ensureEmptyDir(dirPath: string) {
  if (!(await isExist(dirPath))) return;

  const entries = await fs.readdir(dirPath);
  if (entries.length === 0) return;

  throw new Error(`Directory is not empty: ${dirPath}`);
}
