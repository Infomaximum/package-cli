import _webpack, { type Configuration } from "webpack";
import type { StartOptions } from "../../arguments.js";
import { type Mode, type Paths, generatePaths } from "../../paths.js";
import WebpackDevServer from "webpack-dev-server";
import { getDevServerConfig } from "../../configs/webpack/sections/devServer.js";
import { merge } from "webpack-merge";
import { getCommonWidgetConfig } from "../../configs/webpack/common.js";
import { checkLatestLibsVersion } from "../../utils.js";
import { getModifyManifestWidgetPlugin } from "../../configs/webpack/sections/plugins/modifyManifestWidget.js";
import { getReactRefresh } from "../../configs/webpack/sections/plugins/reactRefresh.js";
import { devtoolSection } from "../../configs/webpack/sections/devtool.js";

const { webpack } = _webpack;

export const runDevServer = async (options: StartOptions) => {
  const PATHS = generatePaths({
    entryPath: options.entry,
  });

  await checkLatestLibsVersion();

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

  const pluginsSection = {
    plugins: [
      getModifyManifestWidgetPlugin({
        host,
        port,
      }),
      getReactRefresh(),
    ],
  } satisfies Configuration;

  const configWebpack = [
    getCommonWidgetConfig(mode, PATHS),
    pluginsSection,
    devtoolSection,
  ];

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
