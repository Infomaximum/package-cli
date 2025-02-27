export const CUSTOM_PACKAGE_CLI_LIB_NAME = "@infomaximum/package-cli";

export const BUILD_ARCHIVE_EXT = "zip";

export const MANIFEST_JSON_FILE_NAME = "manifest.json";

export const MANIFEST_REG_EXP = new RegExp(`${MANIFEST_JSON_FILE_NAME}$`, "i");

export const DEV_POSTFIX = "__DEV";
export const DEFAULT_BUILD_DIR_NAME = "build";

export const MANIFEST_SERVICE_FIELDS_FOR_DEVELOPMENT = ["$schema"];

export const AVAILABLE_LANGUAGES = ["ru", "en"] as const;
