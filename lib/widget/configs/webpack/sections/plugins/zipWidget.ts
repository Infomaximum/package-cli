import ZipPlugin from "zip-webpack-plugin";
import { WIDGET_ARCHIVE_NAME } from "../../../../const.js";
import {
  BUILD_ARCHIVE_EXT,
  MANIFEST_JSON_FILE_NAME,
} from "../../../../../const.js";
import { compact } from "../../../../../utils.js";

type Params = {
  isOnlyManifest: boolean;
  widgetResourcesDirName: string | null;
};

export const getZipWidgetPlugin = ({
  isOnlyManifest,
  widgetResourcesDirName,
}: Params) => {
  return new ZipPlugin({
    filename: WIDGET_ARCHIVE_NAME,
    extension: BUILD_ARCHIVE_EXT,
    include: isOnlyManifest
      ? compact([MANIFEST_JSON_FILE_NAME, widgetResourcesDirName])
      : undefined,
  });
};
