export const INTEGRATION_INDEX_TEMPLATE = `\
import pkg from "../package.json";
app = {
  schema: 2,
  version: pkg.version,
  label:"Integration_template",
  description:"",
  blocks: {},
  connections: {},
};
`;
