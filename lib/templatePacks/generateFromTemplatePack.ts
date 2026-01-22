import fs from "node:fs/promises";
import path from "node:path";
import * as fsExtra from "fs-extra";
import { applyTransforms } from "./applyTransforms.js";
import type { RenderContext } from "./renderString.js";
import type { ResolvedTemplatePack } from "./templateSource.js";

export async function generateFromTemplatePack(params: {
  templatePack: ResolvedTemplatePack;
  targetDir: string;
  context: RenderContext;
}) {
  const { templatePack, targetDir, context } = params;

  await fs.mkdir(targetDir, { recursive: true });

  const ignoreNames = templatePack.config.ignoreNames ?? [];

  await fsExtra.copy(templatePack.templateDir, targetDir, {
    filter: (src) => {
      const relative = path.relative(templatePack.templateDir, src);
      if (!relative) return true;
      const parts = relative.split(path.sep);
      return !parts.some((p) => ignoreNames.includes(p));
    },
  });

  await applyTransforms({
    targetDir,
    config: templatePack.config,
    context,
  });
}
