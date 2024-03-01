import _webpack, { type Configuration } from "webpack";
import { type Mode } from "../../paths.js";
import WebpackDevServer from "webpack-dev-server";
import { merge } from "webpack-merge";
import type { MergedStartOptions } from "../commands.js";
import { getModifyManifestWidgetPlugin } from "../configs/webpack/sections/plugins/modifyManifestWidget.js";
import { getReactRefresh } from "../configs/webpack/sections/plugins/reactRefresh.js";
import { getCommonWidgetConfig } from "../configs/webpack/common.js";
import { devtoolSection } from "../configs/webpack/sections/devtool.js";
import { getDevServerConfig } from "../configs/webpack/sections/devServer.js";
import { generateWidgetPaths, type WidgetPaths } from "../widgetPaths.js";
import { checkLatestLibsVersion } from "../utils.js";

const { webpack } = _webpack;

export const runDevServer = async (options: MergedStartOptions) => {
  const PATHS = generateWidgetPaths(options);

  try {
    await run(PATHS, options);
  } catch (error: any) {
    if (error?.message) {
      console.error(error.message);
    }

    process.exit(1);
  }
};

const run = async (WIDGET_PATHS: WidgetPaths, options: MergedStartOptions) => {
  const { host, port } = options;

  const mode: Mode = "development";

  const pluginsSection = {
    plugins: [
      getModifyManifestWidgetPlugin({
        isBuildDevMode: true,
        host,
        port,
        WIDGET_PATHS,
      }),
      getReactRefresh(),
    ],
  } satisfies Configuration;

  const configWebpack = [
    getCommonWidgetConfig(mode, WIDGET_PATHS),
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

  await checkLatestLibsVersion();

  await devServer.start();
};
