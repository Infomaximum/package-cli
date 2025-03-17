import { systemRequire } from "../../../utils.js";
import { transformSync } from "@babel/core";
import webpack, {
  type Compiler,
  type Compilation as CompilationType,
} from "webpack";

const { Compilation } = webpack;

export class ASTIntegrationPreamblePlugin {
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(
      "ASTIntegrationPreamblePlugin",
      (compilation: CompilationType) => {
        compilation.hooks.processAssets.tap(
          {
            name: "ASTIntegrationPreamblePlugin",
            stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
          },
          (assets) => {
            Object.entries(assets).forEach(([filename, source]) => {
              if (!filename.endsWith(".js")) return;

              const { RawSource } = compiler.webpack.sources;

              const output = transformSync(source.source().toString(), {
                sourceType: "unambiguous",
                babelrc: false,
                configFile: false,
                plugins: [
                  [
                    systemRequire.resolve(
                      "@saneksa/babel-plugin-function-transform"
                    ),
                    {
                      functionName: "executePagination",
                      fieldName: "integration",
                    },
                  ],
                ],
              })?.code?.trim();

              if (output) {
                compilation.updateAsset(filename, new RawSource(output));
              }
            });
          }
        );
      }
    );
  }
}
