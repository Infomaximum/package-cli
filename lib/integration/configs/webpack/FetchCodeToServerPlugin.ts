import path from "path";
import fs from "fs";
import crypto from "crypto";
import type { Compiler } from "webpack";
import type { IntegrationFetcher } from "../file.js";

type FetchCodeToServerPluginParams = {
  fetcher: IntegrationFetcher;
};

export class FetchCodeToServerPlugin {
  private fetcher: IntegrationFetcher;

  constructor({ fetcher }: FetchCodeToServerPluginParams) {
    this.fetcher = fetcher;
  }
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap("FetchCodeToServerPlugin", () => {
      const outputPath = compiler.options.output.path || "";
      let filename = compiler.options.output.filename;

      if (typeof filename !== "string") {
        console.warn(
          "⚠️ [FetchCodeToServerPlugin] Dynamic file names are not supported."
        );
        return;
      }

      const filePath = path.resolve(outputPath, filename);

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");

        const result = this.fetcher(content);

        const url = new URL(result.graphqlUrl);

        url.searchParams.set("api_key", result.apiKey);

        const query = result.query;

        const variables = result.variables;

        fetch(url, {
          method: "POST",
          headers: {
            ...result.headers,
            "X-Trace-Id": crypto.randomUUID(),
          },
          body: JSON.stringify({ query, variables }),
        })
          .then((r) => r.json())
          .then((d) => {
            if ((d as any)?.error) {
              throw d;
            }

            console.log(`✅ Отправлено на сервер`);
          })
          .catch((e) => {
            console.error(`❗ Ошибка при отправке кода на сервер\n`);
            console.error(JSON.stringify(e));
          });
      } else {
        console.warn(
          `⚠️ [FetchCodeToServerPlugin] File ${filename} was not found.`
        );
      }
    });
  }
}
