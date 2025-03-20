import { systemRequire } from "../../../utils.js";
import { transformSync } from "@babel/core";
import webpack, {
  type Compiler,
  type Compilation as CompilationType,
} from "webpack";
import { minify } from "terser";
import { TERSER_OPTIONS } from "./utils.js";

const { Compilation } = webpack;

async function minifyCode(
  code: string,
  isBeautifyCode: boolean
): Promise<string> {
  const result = await minify(code, TERSER_OPTIONS(isBeautifyCode));

  if (result.code) {
    return result.code;
  }
  throw new Error("Минификация не удалась");
}
type ASTIntegrationPreamblePluginParams = { isBeautifyCode: boolean };
export class ASTIntegrationPreamblePlugin {
  private isBeautifyCode: boolean;

  constructor({ isBeautifyCode }: ASTIntegrationPreamblePluginParams) {
    this.isBeautifyCode = isBeautifyCode;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(
      "ASTIntegrationPreamblePlugin",
      (compilation: CompilationType) => {
        compilation.hooks.processAssets.tapPromise(
          {
            name: "ASTIntegrationPreamblePlugin",
            stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
          },
          async (assets) => {
            for await (const [filename, source] of Object.entries(assets)) {
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
                const outputCode = await minifyCode(
                  output,
                  this.isBeautifyCode
                );

                compilation.updateAsset(filename, new RawSource(outputCode));
              }
            }
          }
        );
      }
    );
  }
}
