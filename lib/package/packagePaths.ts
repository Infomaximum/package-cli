import { _resolveApp, generateGlobalPaths } from "../paths.js";

type PackageOptions = {
  buildDirPath: string;
  packageDir: string;
  packageManifest: string;
};

export type PackagePaths = ReturnType<typeof generatePackagePaths>;

export function generatePackagePaths({
  packageDir,
  packageManifest,
  buildDirPath,
}: PackageOptions) {
  const globalPaths = generateGlobalPaths({ buildDirPath });

  const resolveApp = _resolveApp();

  return {
    ...globalPaths,
    packageDirPath: resolveApp(packageDir),
    packageManifestPath: resolveApp(packageManifest),
  };
}
