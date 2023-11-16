import { webpack } from "webpack";
import { StartOptions } from "../arguments";
import { Mode, Paths, generatePaths } from "../paths";
import WebpackDevServer from "webpack-dev-server";
import { getDevServerConfig } from "../configs/webpack/devServer";
import { getCommonWidgetConfig } from "../configs/webpack/common";
import merge from "webpack-merge";

export const runDevServer = async (options: StartOptions) => {
  const PATHS = generatePaths({
    entryPath: options.entry,
  });

  try {
    await run(PATHS, options);
  } catch (error: any) {
    if (error?.message) {
      console.error(error.message);
    }

    process.exit(1);
  }
};

const run = async (PATHS: Paths, options: StartOptions) => {
  const { host, port } = options;

  const mode: Mode = "development";

  const configWebpack = [getCommonWidgetConfig(mode, PATHS)];

  const compiler = webpack(merge(configWebpack));

  const devServerConfig = getDevServerConfig({
    host,
    port,
  });

  const devServer = new WebpackDevServer(devServerConfig, compiler);

  ["SIGINT", "SIGTERM"].forEach(function (sig) {
    process.on(sig, function () {
      devServer.close();
      process.exit();
    });
  });

  process.stdin.on("end", function () {
    devServer.close();
    process.exit();
  });

  await devServer.start();
};
