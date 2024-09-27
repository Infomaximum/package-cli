import path from "node:path";
import {
  _resolveApp,
  generateGlobalPaths,
  generateIndexPath,
} from "../paths.js";
import type { MergedBuildOptions } from "./commands/build.js";
import type { MergedStartOptions } from "./commands/start.js";

const resolveApp = _resolveApp();

export type WidgetPaths = ReturnType<typeof generateWidgetPaths>;

type Options = MergedBuildOptions | MergedStartOptions;

export function generateWidgetPaths({
  entry,
  assetsDir,
  widgetManifest,
  buildDir,
}: Options) {
  const globalPaths = generateGlobalPaths({ buildDirPath: buildDir });

  return {
    ...globalPaths,
    get moduleIndex() {
      return generateIndexPath(entry);
    },

    widgetManifestJsonPath: getWidgetManifestPath(widgetManifest),
    widgetResourcesPath: assetsDir ? resolveApp(assetsDir) : null,
    widgetResourcesDirName: assetsDir ? path.basename(assetsDir) : null,
    widgetBuildDirPath: resolveApp(buildDir),
  };
}

export function getWidgetManifestPath(widgetManifest: string) {
  return resolveApp(widgetManifest);
}
