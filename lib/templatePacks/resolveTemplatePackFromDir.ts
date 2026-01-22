import fs from "node:fs/promises";
import path from "node:path";
import { isExist } from "../utils.js";
import type { ResolvedTemplatePack, TemplatePackConfig } from "./templateSource.js";

const DEFAULT_IGNORE_NAMES = [
  "node_modules",
  "dist",
  ".git",
  ".idea",
  ".vscode",
  ".DS_Store",
];

const CONFIG_FILE_NAME = "template.config.json";

export async function resolveTemplatePackFromDir(
  rootDir: string
): Promise<ResolvedTemplatePack> {
  const config = await readTemplatePackConfig(rootDir);
  const templateDirName = config.templateDir ?? "template";
  const templateDir = path.join(rootDir, templateDirName);

  if (!(await isExist(templateDir))) {
    throw new Error(
      `Template dir does not exist: ${templateDir} (root: ${rootDir})`
    );
  }

  return {
    rootDir,
    templateDir,
    config,
  };
}

async function readTemplatePackConfig(rootDir: string): Promise<TemplatePackConfig> {
  const configPath = path.join(rootDir, CONFIG_FILE_NAME);

  if (!(await isExist(configPath))) {
    return {
      ignoreNames: DEFAULT_IGNORE_NAMES,
    };
  }

  const raw = await fs.readFile(configPath, { encoding: "utf8" });
  const parsed = JSON.parse(raw) as TemplatePackConfig;

  const mergedIgnoreNames = [
    ...DEFAULT_IGNORE_NAMES,
    ...(parsed.ignoreNames ?? []),
  ];
  const { ignoreNames: _ignoreNames, ...restParsed } = parsed;

  return {
    ignoreNames: mergedIgnoreNames,
    ...restParsed,
  };
}
