import { INTEGRATION_SDK_LIB_NAME } from "../const.js";

export const INTEGRATION_INDEX_TEMPLATE = `\
/// <reference types="${INTEGRATION_SDK_LIB_NAME}" />

integration = {
  schema: 1,
  meta: {
    key: "integrationKey",
    name: "",
    description: "",
  },
  blocks: [],
  connections: [],
};
`;
