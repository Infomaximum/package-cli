import ZipPlugin from "zip-webpack-plugin";
import { APPLICATION_ARCHIVE_FULL_NAME } from "../../../../const.js";
import {
  BUILD_ARCHIVE_EXT,
  MANIFEST_JSON_FILE_NAME,
} from "../../../../../const.js";
import { compact } from "../../../../../utils.js";

type Params = {
  isOnlyManifest: boolean;
};

export const getZipApplicationPlugin = ({ isOnlyManifest }: Params) => {
  return new ZipPlugin({
    filename: APPLICATION_ARCHIVE_FULL_NAME,
    extension: BUILD_ARCHIVE_EXT,
    include: isOnlyManifest ? compact([MANIFEST_JSON_FILE_NAME]) : undefined,
  });
};
