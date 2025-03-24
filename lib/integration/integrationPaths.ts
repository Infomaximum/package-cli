import { generatePackagePaths } from "../package/packagePaths.js";
import { generateIndexPath } from "../paths.js";
import { INTEGRATION_OUTPUT_FILE } from "./const.js";

export type IntegrationPaths = ReturnType<typeof generateIntegrationPaths>;

type CommonOptions = {
  entry: string;
};

type Options = {
  buildDir: string;
  packageDir: string;
  packageManifest: string;
} & CommonOptions;

export function generateCommonIntegrationPaths({ entry }: CommonOptions) {
  return {
    get moduleIndex() {
      return generateIndexPath(entry);
    },
  };
}

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
    ...generateCommonIntegrationPaths({ entry }),
  };
}
