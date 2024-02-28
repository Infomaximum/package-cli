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

  const packagePath = resolveApp(packageDir);

  return {
    ...globalPaths,
    packagePath,
    packageDirPath: resolveApp(packageDir),
    packageManifestPath: resolveApp(packageManifest),
  };
}
