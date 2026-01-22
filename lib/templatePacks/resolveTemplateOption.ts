import { isExist } from "../utils.js";
import type { TemplateSource } from "./templateSource.js";

export async function resolveTemplateOption(
  template: string
): Promise<Exclude<TemplateSource, { type: "inline" }>> {
  if (template.startsWith(".") || template.startsWith("/")) {
    return {
      type: "dir",
      dirPath: template,
    };
  }

  if (await isExist(template)) {
    return {
      type: "dir",
      dirPath: template,
    };
  }

  return {
    type: "npm",
    spec: template,
  };
}

