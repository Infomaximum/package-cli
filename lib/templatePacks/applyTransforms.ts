import fs from "node:fs/promises";
import path from "node:path";
import detectIndent from "detect-indent";
import { detectNewline } from "detect-newline";
import stringifyPackage from "stringify-package";
import type { TemplatePackConfig } from "./templateSource.js";
import { renderString, type RenderContext } from "./renderString.js";

const DEFAULT_TEXT_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".yaml",
  ".yml",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".txt",
];

export async function applyTransforms(params: {
  targetDir: string;
  config: TemplatePackConfig;
  context: RenderContext;
}) {
  const { targetDir, config, context } = params;

  await applyPathRewrites({ targetDir, config, context });
  await applyReplacements({ targetDir, config, context });
  await applyJsonEdits({ targetDir, config, context });
}

async function applyPathRewrites(params: {
  targetDir: string;
  config: TemplatePackConfig;
  context: RenderContext;
}) {
  const { targetDir, config, context } = params;
  const rules = (config.pathRewrites ?? []).map((r) => ({
    from: r.from,
    to: renderString(r.to, context),
  }));

  if (rules.length === 0) return;

  const entries = await listEntriesRecursively(targetDir);
  const dirs = entries.filter((e) => e.type === "dir");

  dirs.sort((a, b) => b.depth - a.depth);

  for (const dir of dirs) {
    const base = path.basename(dir.absolutePath);
    const nextBase = applyRewriteRules(base, rules);
    if (nextBase === base) continue;

    const nextPath = path.join(path.dirname(dir.absolutePath), nextBase);
    await fs.rename(dir.absolutePath, nextPath);
  }

  const entriesAfterDirs = await listEntriesRecursively(targetDir);
  const files = entriesAfterDirs.filter((e) => e.type === "file");

  files.sort((a, b) => b.depth - a.depth);

  for (const file of files) {
    const base = path.basename(file.absolutePath);
    const nextBase = applyRewriteRules(base, rules);
    if (nextBase === base) continue;

    const nextPath = path.join(path.dirname(file.absolutePath), nextBase);
    await fs.rename(file.absolutePath, nextPath);
  }
}

async function applyReplacements(params: {
  targetDir: string;
  config: TemplatePackConfig;
  context: RenderContext;
}) {
  const { targetDir, config, context } = params;
  const rules = (config.replacements ?? []).map((r) => ({
    from: r.from,
    to: renderString(r.to, context),
    includeExtensions: normalizeExtensions(r.includeExtensions),
  }));

  if (rules.length === 0) return;

  const files = await listFilesRecursively(targetDir);

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();

    const applicableRules = rules.filter((r) =>
      (r.includeExtensions ?? DEFAULT_TEXT_EXTENSIONS).includes(ext)
    );
    if (applicableRules.length === 0) continue;

    const raw = await fs.readFile(filePath, { encoding: "utf8" });
    const next = applicableRules.reduce(
      (acc, r) => acc.split(r.from).join(r.to),
      raw
    );

    if (next !== raw) {
      await fs.writeFile(filePath, next, { encoding: "utf8" });
    }
  }
}

async function applyJsonEdits(params: {
  targetDir: string;
  config: TemplatePackConfig;
  context: RenderContext;
}) {
  const { targetDir, config, context } = params;
  const edits = config.jsonEdits ?? [];
  if (edits.length === 0) return;

  for (const edit of edits) {
    const filePath = path.join(targetDir, edit.file);
    const raw = await fs.readFile(filePath, { encoding: "utf8" });
    const json = JSON.parse(raw) as Record<string, any>;
    const indent = detectIndent(raw).indent || "  ";
    const newline = detectNewline(raw) ?? "\n";

    for (const [key, valueTemplate] of Object.entries(edit.set)) {
      json[key] = renderString(valueTemplate, context);
    }

    const nextRaw = stringifyPackage(json, indent, newline);
    if (nextRaw !== raw) {
      await fs.writeFile(filePath, nextRaw, { encoding: "utf8" });
    }
  }
}

function applyRewriteRules(
  value: string,
  rules: Array<{ from: string; to: string }>
): string {
  return rules.reduce((acc, r) => acc.split(r.from).join(r.to), value);
}

function normalizeExtensions(extensions?: string[]): string[] | undefined {
  if (!extensions) return undefined;
  return extensions.map((e) => (e.startsWith(".") ? e : `.${e}`));
}

type Entry = {
  absolutePath: string;
  type: "file" | "dir";
  depth: number;
};

async function listEntriesRecursively(dirPath: string): Promise<Entry[]> {
  const out: Entry[] = [];

  async function walk(currentPath: string, depth: number) {
    const items = await fs.readdir(currentPath, { withFileTypes: true });

    for (const item of items) {
      const absolutePath = path.join(currentPath, item.name);
      if (item.isDirectory()) {
        out.push({ absolutePath, type: "dir", depth });
        await walk(absolutePath, depth + 1);
      } else if (item.isFile()) {
        out.push({ absolutePath, type: "file", depth });
      }
    }
  }

  await walk(dirPath, 1);
  return out;
}

async function listFilesRecursively(dirPath: string): Promise<string[]> {
  const entries = await listEntriesRecursively(dirPath);
  return entries.filter((e) => e.type === "file").map((e) => e.absolutePath);
}

