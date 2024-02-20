import ZipPlugin from "zip-webpack-plugin";
import {
  BUILD_ARCHIVE_EXT,
  MANIFEST_JSON_FILE_NAME,
  WIDGET_ARCHIVE_NAME,
  WIDGET_RESOURCES_PATH_NAME,
} from "../../../../const.js";

export const getZipWidgetPlugin = (isOnlyManifest: boolean) => {
  return new ZipPlugin({
    filename: WIDGET_ARCHIVE_NAME,
    extension: BUILD_ARCHIVE_EXT,
    include: isOnlyManifest
      ? [MANIFEST_JSON_FILE_NAME, WIDGET_RESOURCES_PATH_NAME]
      : undefined,
  });
};
