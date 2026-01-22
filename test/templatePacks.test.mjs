import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, it } from "mocha";
import { resolveTemplatePackFromDir } from "../dist/templatePacks/resolveTemplatePackFromDir.js";
import { generateFromTemplatePack } from "../dist/templatePacks/generateFromTemplatePack.js";

describe("template packs", () => {
  it("copies template dir, applies rewrites/replacements/jsonEdits, respects ignore", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "im-pkg-cli-test-"));
    try {
      const templatePackRoot = path.join(tempRoot, "pack");
      const templateDir = path.join(templatePackRoot, "template");
      await fs.mkdir(path.join(templateDir, "src"), { recursive: true });
      await fs.mkdir(path.join(templateDir, "node_modules"), { recursive: true });

      await fs.writeFile(
        path.join(templatePackRoot, "template.config.json"),
        JSON.stringify(
          {
            pathRewrites: [{ from: "TemplateWidget", to: "{{className}}" }],
            replacements: [{ from: "TemplateWidget", to: "{{className}}" }],
            jsonEdits: [
              {
                file: "package.json",
                set: { name: "{{packageName}}", author: "{{author}}" },
              },
            ],
          },
          null,
          2
        ),
        "utf8"
      );

      await fs.writeFile(
        path.join(templateDir, "package.json"),
        JSON.stringify({ name: "template", author: "template" }, null, 2) + "\n",
        "utf8"
      );

      await fs.writeFile(
        path.join(templateDir, "src", "TemplateWidget.ts"),
        'export class TemplateWidget { public name = "TemplateWidget"; }\n',
        "utf8"
      );

      await fs.writeFile(
        path.join(templateDir, "node_modules", "should-not-copy.txt"),
        "nope",
        "utf8"
      );

      const resolved = await resolveTemplatePackFromDir(templatePackRoot);
      const targetDir = path.join(tempRoot, "out");

      await generateFromTemplatePack({
        templatePack: resolved,
        targetDir,
        context: {
          packageName: "@scope/my-widget",
          className: "MyWidget",
          author: "Me",
        },
      });

      const renamedFile = path.join(targetDir, "src", "MyWidget.ts");
      const oldFile = path.join(targetDir, "src", "TemplateWidget.ts");
      const ignoredFile = path.join(targetDir, "node_modules", "should-not-copy.txt");

      await assert.rejects(() => fs.stat(oldFile));
      await assert.rejects(() => fs.stat(ignoredFile));

      const content = await fs.readFile(renamedFile, "utf8");
      assert.match(content, /export class MyWidget/);
      assert.match(content, /name = "MyWidget"/);

      const pkg = JSON.parse(await fs.readFile(path.join(targetDir, "package.json"), "utf8"));
      assert.equal(pkg.name, "@scope/my-widget");
      assert.equal(pkg.author, "Me");
    } finally {
      await fs.rm(tempRoot, { recursive: true, force: true });
    }
  });
});

