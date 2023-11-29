import fs from "node:fs";
import path from "node:path";
import { systemRequire } from "./utils.js";

export type TGeneratePathsArgs = {
  entryPath: string;
};

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
  "module.ts",
  "module.tsx",
] as const;

const resolveModule = <T extends (...args: any) => any>(
  resolveFn: T,
  filePath: string
): ReturnType<T> => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

export const generatePaths = (args: TGeneratePathsArgs) => {
  const packagePath = resolveApp("package");

  return {
    appPath: resolveApp("."),
    appBuild: resolveApp("build"),
    moduleIndex: generateIndexPath(args.entryPath),
    appPackageJson: resolveApp("package.json"),
    manifestJson: resolveApp("manifest.json"),
    packagePath,
    packageManifest: resolveApp(path.resolve(packagePath, "manifest.json")),
    appTsConfig: resolveApp("tsconfig.json"),
    appNodeModules: resolveApp("node_modules"),
    publicPath: "/",
  };
};

export const MODE = {
  DEV: "development",
  PROD: "production",
} as const;

export type Mode = (typeof MODE)[keyof typeof MODE];
export type Paths = ReturnType<typeof generatePaths>;

export const generateIndexPath = (entryPath?: string) => {
  const indexSrcPath = resolveModule(resolveApp, "src/index");

  if (entryPath && fs.existsSync(entryPath)) {
    return entryPath;
  }

  try {
    const mainIndexPath = path.resolve(
      process.cwd(),
      systemRequire(resolveApp("package.json"))?.main
    );

    if (mainIndexPath && fs.existsSync(mainIndexPath)) {
      return mainIndexPath;
    }
  } catch (error) {
    console.error("Не найдена секция main в package.json");
    process.exit(1);
  }

  if (fs.existsSync(indexSrcPath)) {
    return indexSrcPath;
  }

  console.error("Не найден входной файл");
  process.exit(1);
};
