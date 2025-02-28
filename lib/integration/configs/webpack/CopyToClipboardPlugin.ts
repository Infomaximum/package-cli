import path from "path";
import fs from "fs";
import clipboardy from "clipboardy";
import type { Compiler } from "webpack";

export class CopyToClipboardPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap("CopyToClipboardPlugin", () => {
      const outputPath = compiler.options.output.path || "";
      let filename = compiler.options.output.filename;

      if (typeof filename !== "string") {
        console.warn(
          "⚠️ [CopyToClipboardPlugin] Dynamic file names are not supported."
        );
        return;
      }

      const filePath = path.resolve(outputPath, filename);

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        clipboardy.writeSync(content);
      } else {
        console.warn(
          `⚠️ [CopyToClipboardPlugin] File ${filename} was not found.`
        );
      }
    });
  }
}
