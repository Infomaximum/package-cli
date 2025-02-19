import { _resolveApp, generateGlobalPaths } from "../paths.js";

type PackageOptions = {
  buildDir: string;
  packageDir: string;
  packageManifest: string;
};

export type PackagePaths = ReturnType<typeof generatePackagePaths>;

export function generatePackagePaths({
  packageDir,
  packageManifest,
  buildDir,
}: PackageOptions) {
  const globalPaths = generateGlobalPaths({ buildDir });
  const resolveApp = _resolveApp();

  const packagePath = resolveApp(packageDir);

  return {
    ...globalPaths,
    packagePath,
    packageDirPath: resolveApp(packageDir),
    packageManifestPath: resolveApp(packageManifest),
  };
}
