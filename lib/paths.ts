import fs from "node:fs";
import path from "node:path";
import { systemRequire } from "./utils.js";
import chalk from "chalk";
import { MANIFEST_JSON_FILE_NAME } from "./const.js";

export type TGeneratePathsArgs = {
  entryPath: string;
  cwd?: string;
};

const appDirectory = fs.realpathSync(process.cwd());
const _resolveApp =
  (cwd = appDirectory) =>
  (relativePath: string) =>
    path.resolve(cwd, relativePath);

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
  const { entryPath, cwd } = args;

  const resolveApp = _resolveApp(cwd);

  const packagePath = resolveApp("package");

  return {
    appPath: resolveApp("."),
    appBuild: resolveApp("build"),
    get moduleIndex() {
      return generateIndexPath(cwd, entryPath);
    },
    appPackageJson: resolveApp("package.json"),
    manifestJson: resolveApp(MANIFEST_JSON_FILE_NAME),
    packagePath,
    packageManifest: resolveApp(
      path.resolve(packagePath, MANIFEST_JSON_FILE_NAME)
    ),
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

const generateIndexPath = (cwd?: string, entryPath?: string) => {
  const resolveApp = _resolveApp(cwd);

  const indexSrcPath = resolveModule(resolveApp, "src/index");

  if (entryPath && fs.existsSync(entryPath)) {
    return entryPath;
  }

  try {
    const mainIndexPath = resolveApp(
      systemRequire(resolveApp("package.json"))?.main
    );

    if (mainIndexPath && fs.existsSync(mainIndexPath)) {
      return mainIndexPath;
    }
  } catch (error) {
    console.error(chalk.red("main field not found in package.json"));
  }

  if (fs.existsSync(indexSrcPath)) {
    return indexSrcPath;
  }

  console.error(chalk.red("entry file not found"));
  process.exit(1);
};
