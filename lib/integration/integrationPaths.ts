import { generatePackagePaths } from "../package/packagePaths.js";
import { generateIndexPath } from "../paths.js";
import { INTEGRATION_OUTPUT_FILE } from "./const.js";

export type IntegrationPaths = ReturnType<typeof generateIntegrationPaths>;

type Options = {
  entry: string;
  buildDir: string;
  packageDir: string;
  packageManifest: string;
};

export function generateIntegrationPaths({
  entry,
  buildDir,
  packageDir,
  packageManifest,
}: Options) {
  const packagePaths = generatePackagePaths({
    buildDir,
    packageDir,
    packageManifest,
  });

  return {
    ...packagePaths,
    outputFile: INTEGRATION_OUTPUT_FILE,
    get moduleIndex() {
      return generateIndexPath(entry);
    },
  };
}
