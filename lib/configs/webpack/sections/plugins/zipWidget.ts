import ZipPlugin from "zip-webpack-plugin";
import { BUILD_ARCHIVE_EXT, WIDGET_ARCHIVE_NAME } from "../../../../const.js";

export const getZipWidgetPlugin = () => {
  return new ZipPlugin({
    filename: WIDGET_ARCHIVE_NAME,
    extension: BUILD_ARCHIVE_EXT,
  });
};
