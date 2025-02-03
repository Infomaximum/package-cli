import { AVAILABLE_LANGUAGES, MANIFEST_JSON_FILE_NAME } from "../../const.js";
import type { PackageType } from "../../types.js";
import { capitalizeFirstLetter } from "../../utils.js";
import { GET_CHANGELOG_MD, GET_DOC_MD } from "../templates/additionalFiles.js";
import { PACKAGE_ICON_TEMPLATE } from "../templates/packageIcon.js";
import { PACKAGE_MANIFEST_TEMPLATE } from "../templates/packageManifest.js";

export type PackageActionsParams = {
  packageType: PackageType;
};

export const getPackageActions = ({ packageType }: PackageActionsParams) => {
  const packageIconName = capitalizeFirstLetter(packageType);

  return [
    //---------------------------------------PACKAGE------------------------------------
    {
      type: "add",
      path: `package/${MANIFEST_JSON_FILE_NAME}`,
      template: PACKAGE_MANIFEST_TEMPLATE,
      data: {
        packageIconName,
        packageType: packageType,
      },
    },
    {
      type: "add",
      path: `package/resources/${packageIconName}.svg`,
      template: PACKAGE_ICON_TEMPLATE,
    },
    ...AVAILABLE_LANGUAGES.flatMap((language) => [
      {
        type: "add",
        path: `package/${language}/doc.md`,
        template: GET_DOC_MD(language),
      },
      {
        type: "add",
        path: `package/${language}/changelog.md`,
        template: GET_CHANGELOG_MD(language),
      },
    ]),
  ];
};
