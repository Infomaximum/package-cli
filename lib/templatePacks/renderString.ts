import Handlebars from "handlebars";
import { capitalizeFirstLetter } from "../utils.js";

export type RenderContext = Record<string, unknown>;

const hb = Handlebars.create();

hb.registerHelper("capitalize", (value: unknown) =>
  capitalizeFirstLetter(String(value ?? ""))
);
hb.registerHelper("pascalCase", (value: unknown) => toPascalCase(String(value ?? "")));
hb.registerHelper("camelCase", (value: unknown) => {
  const p = toPascalCase(String(value ?? ""));
  return p ? p.charAt(0).toLowerCase() + p.slice(1) : "";
});

export function renderString(template: string, context: RenderContext): string {
  if (!template.includes("{{")) {
    return template;
  }

  const compiled = hb.compile(template, { noEscape: true });
  return compiled(context);
}

function toPascalCase(input: string): string {
  const cleaned = input
    .replace(/^@[^/]+\//, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();

  if (!cleaned) return "";

  return cleaned
    .split(/\s+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

