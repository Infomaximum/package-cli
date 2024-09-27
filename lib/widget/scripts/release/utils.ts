import { Bumper } from "conventional-recommended-bump";
import detectIndent from "detect-indent";
import { detectNewline } from "detect-newline";
import semver, { type ReleaseType } from "semver";

export const getRecommendedReleaseType = async (
  projectPath: string
): Promise<ReleaseType> => {
  const bumper = new Bumper(projectPath).loadPreset("angular");

  const recommendation = await bumper.bump();

  return (recommendation.releaseType as ReleaseType | undefined) ?? "patch";
};

export const validateSystemVersion =
  (currentMajorVersion: number) => (version: number | undefined) => {
    if (!version) {
      return "Версия не была указана, укажите версию";
    }

    const versionStr = `${version}`;

    const versionRegex = /^\d{4}$/;

    if (!versionRegex.test(versionStr)) {
      return `Указанная версия (${version}) не соответствует шаблону версии системы 2409`;
    }

    if (version <= currentMajorVersion) {
      return `Указанная версия системы (${version}) должна быть больше текущей версии (${currentMajorVersion}) `;
    }

    const year = parseInt(versionStr.slice(0, 2), 10);
    const month = parseInt(versionStr.slice(2, 4), 10);

    if (year >= 23 && month >= 1 && month <= 12) {
      return true;
    }

    return `Указанная версия (${version}) не является валидной`;
  };

export const getJsonContentFile = (content: string) => {
  const json = JSON.parse(content);
  const indent = detectIndent(content).indent;
  const newline = detectNewline(content);

  return {
    json,
    indent,
    newline,
  };
};
