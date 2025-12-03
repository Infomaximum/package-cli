import _webpack, { type Configuration } from "webpack";
import { type Mode } from "../../paths.js";
import WebpackDevServer from "webpack-dev-server";
import { merge } from "webpack-merge";
import { getModifyManifestApplicationPlugin } from "../configs/webpack/sections/plugins/modifyManifestApplication.js";
import { getReactRefresh } from "../configs/webpack/sections/plugins/reactRefresh.js";
import { getCommonApplicationWebpackConfig } from "../configs/webpack/common.js";
import { devtoolSection } from "../configs/webpack/sections/devtool.js";
import { getDevServerConfig } from "../configs/webpack/sections/devServer.js";
import {
  generateApplicationPaths,
  type ApplicationPaths,
} from "../applicationPaths.js";
import type { MergedApplicationStartOptions } from "../commands/start.js";

const { webpack } = _webpack;

export const runApplicationDevServer = async (
  options: MergedApplicationStartOptions
) => {
  const PATHS = generateApplicationPaths(options);

  try {
    await run(PATHS, options);
  } catch (error: any) {
    if (error?.message) {
      console.error(error.message);
    }

    process.exit(1);
  }
};

const run = async (
  APPLICATION_PATHS: ApplicationPaths,
  options: MergedApplicationStartOptions
) => {
  const { host, port } = options;

  const mode: Mode = "development";

  const pluginsSection = {
    plugins: [
      getModifyManifestApplicationPlugin({
        isBuildDevMode: true,
        host,
        port,
        APPLICATION_PATHS,
      }),
      getReactRefresh(),
    ],
  } satisfies Configuration;

  const configWebpack = [
    getCommonApplicationWebpackConfig(mode, APPLICATION_PATHS),
    pluginsSection,
    devtoolSection,
  ];

  const compiler = webpack(merge(configWebpack));

  const devServerConfig = getDevServerConfig({
    host,
    port: String(port),
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
