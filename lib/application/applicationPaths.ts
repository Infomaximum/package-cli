import path from "node:path";
import {
  _resolveApp,
  generateGlobalPaths,
  generateIndexPath,
} from "../paths.js";
import type { MergedApplicationBuildOptions } from "./commands/build.js";
// import type { MergedStartOptions } from "./commands/start.js";

const resolveApp = _resolveApp();

export type ApplicationPaths = ReturnType<typeof generateApplicationPaths>;

type Options = MergedApplicationBuildOptions; //| MergedStartOptions;

export function generateApplicationPaths({
  entry,
  applicationManifest,
  buildDir,
}: Options) {
  const globalPaths = generateGlobalPaths({ buildDir });

  return {
    ...globalPaths,
    get moduleIndex() {
      return generateIndexPath(entry);
    },

    applicationManifestJsonPath: resolveApp(applicationManifest),
    applicationBuildDirPath: resolveApp(buildDir),
  };
}
