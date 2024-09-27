import { Bumper } from "conventional-recommended-bump";
import semver, { type ReleaseType } from "semver";

export const getRecommendedReleaseType = async (
  projectPath: string
): Promise<ReleaseType> => {
  const bumper = new Bumper(projectPath).loadPreset("angular");

  const recommendation = await bumper.bump();

  return (recommendation.releaseType as ReleaseType | undefined) ?? "patch";
};

export const getBumpedMajorVersion = (
  currentVersion: string,
  targetMajor: number
) => {
  let newVersion = currentVersion;

  while (semver.major(newVersion) < targetMajor) {
    newVersion = semver.inc(newVersion, "major")!;
  }

  return newVersion;
};

export const validateSystemVersion = (version: number | undefined) => {
  if (!version) {
    return "Версия не была указана, укажите версию";
  }

  const versionStr = `${version}`;

  const versionRegex = /^\d{4}$/;

  if (!versionRegex.test(versionStr)) {
    return "Указанная версия не соответствует шаблону версии системы 2409";
  }

  const year = parseInt(versionStr.slice(0, 2), 10);
  const month = parseInt(versionStr.slice(2, 4), 10);

  if (year >= 24 && month >= 1 && month <= 12) {
    return true;
  }

  return "Указанная версия не является валидной";
};
