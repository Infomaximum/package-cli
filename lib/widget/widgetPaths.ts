import path from "node:path";
import {
  _resolveApp,
  generateGlobalPaths,
  generateIndexPath,
} from "../paths.js";
import type { MergedBuildOptions } from "./commands/build.js";
import type { MergedStartOptions } from "./commands/start.js";
import type { MergedBuildScriptOptions } from "./commands/build_script.js";

const resolveApp = _resolveApp();

export type WidgetPaths = ReturnType<typeof generateWidgetPaths>;

type Options =
  | MergedBuildOptions
  | MergedStartOptions
  | MergedBuildScriptOptions;

export function generateWidgetPaths({
  entry,
  assetsDir,
  widgetManifest,
  buildDir,
}: Options) {
  const globalPaths = generateGlobalPaths({ buildDir });

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
