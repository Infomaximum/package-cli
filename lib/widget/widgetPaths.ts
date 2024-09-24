import path from "node:path";
import {
  _resolveApp,
  generateGlobalPaths,
  generateIndexPath,
} from "../paths.js";
import type { MergedBuildOptions } from "./commands/build.js";
import type { MergedStartOptions } from "./commands/start.js";

export type WidgetPaths = ReturnType<typeof generateWidgetPaths>;

type Options = MergedBuildOptions | MergedStartOptions;

export function generateWidgetPaths({
  entry,
  assetsDir,
  widgetManifest,
  buildDir,
}: Options) {
  const globalPaths = generateGlobalPaths({ buildDirPath: buildDir });

  const resolveApp = _resolveApp();

  return {
    ...globalPaths,
    get moduleIndex() {
      return generateIndexPath(entry);
    },

    widgetManifestJsonPath: resolveApp(widgetManifest),
    widgetResourcesPath: assetsDir ? resolveApp(assetsDir) : null,
    widgetResourcesDirName: assetsDir ? path.basename(assetsDir) : null,
    widgetBuildDirPath: resolveApp(buildDir),
  };
}
