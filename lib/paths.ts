import fs from "node:fs";
import path from "node:path";
import { systemRequire } from "./utils.js";
import chalk from "chalk";

export type TGeneratePathsArgs = {
  cwd?: string;
  buildDirPath: string;
};

export const appDirectory = fs.realpathSync(process.cwd());

export const _resolveApp =
  (cwd = appDirectory) =>
  (relativePath: string) =>
    path.resolve(cwd, relativePath);

export const generateGlobalPaths = (args: TGeneratePathsArgs) => {
  const { cwd, buildDirPath } = args || {};

  const resolveApp = _resolveApp(cwd);
  const packagePath = resolveApp("package");

  return {
    appPath: resolveApp("."),
    appBuildPath: resolveApp(buildDirPath),
    appPackageJson: resolveApp("package.json"),
    packagePath,
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
export type Paths = ReturnType<typeof generateGlobalPaths>;

export const generateIndexPath = (entryPath?: string) => {
  const resolveApp = _resolveApp();

  if (entryPath) {
    const _entryPath = resolveApp(entryPath);

    if (fs.existsSync(_entryPath)) {
      return _entryPath;
    }
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

  console.error(chalk.red("entry file not found"));
  process.exit(1);
};
