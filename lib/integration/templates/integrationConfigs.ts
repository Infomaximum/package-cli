import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import { INTEGRATION_SDK_LIB_NAME } from "../const.js";

export const INTEGRATION_TSCONFIG_JSON = `\
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["ES2015"],
    "types": ["${INTEGRATION_SDK_LIB_NAME}"],
    "module": "Preserve",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": false
  },
  "include": ["src"]
}
`;

export const INTEGRATION_GITIGNORE = `\
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/dist

#documentation
/docs

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

/build
.ultra.cache.json
*.tsbuildinfo
.node-xmlhttprequest-content-*
.node-xmlhttprequest-sync-*
`;

export const INTEGRATION_BABEL_CONFIG = `\
module.exports = {
  sourceType: "unambiguous",
  presets: [],
  plugins: ["@babel/plugin-transform-block-scoping"],
};
`;

export const INTEGRATION_ESLINTRC = `\
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "build"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {},
    rules: {},
  }
);
`;

export const INTEGRATION_VITEST_CONFIG = `\
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
        provider:'v8',
      exclude: [
        '**/*.config.*',
        'src/index.ts',
      ],
    },
  },
});
`;

export const INTEGRATION_RC_CONFIG = `\
//@ts-check

require("dotenv").config();

const query = \`
mutation UpdateIntegration($id: Long!, $js_code: String) {
    automation {
        integration {
          update(id: $id, js_code: $js_code) {
              id
          }
        }
    }
}\`;

/**
 *  @type {import("${CUSTOM_PACKAGE_CLI_LIB_NAME}").IntegrationRCConfig}
 */
const config = {
  entry: "src/index.ts",
  fetcher: (integrationCode) => {
    return {
      graphqlUrl: process.env.GRAPHQL_URL,
      apiKey: process.env.API_KEY,
      query,
      variables: {
        id: process.env.INTEGRATION_ID,
        js_code: integrationCode,
      },
    };
  },

  debugging: {
    seriesIterations: 3,
    commonAuthData: {
      BASE_URL: process.env.WEBHOOK_URL
    },
    blocks: {},
    connections: {},
  },
};

module.exports = config;
`;

export const INTEGRATION_ENV_EXAMPLE_CONFIG = `\
INTEGRATION_ID=0
GRAPHQL_URL=https://example.com/graphql
API_KEY=123456789qwertyuiop
WEBHOOK_URL=https://example.com/webhook
`;

const splitLibName = CUSTOM_PACKAGE_CLI_LIB_NAME.split("/");

export const INTEGRATION_VSCODE_LAUNCH = `\
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Integration",
      "skipFiles": ["<node_internals>/**"],
 
      "runtimeArgs": ["--preserve-symlinks", "--import", "tsx"],
      "program": "\${workspaceFolder}\${pathSeparator}node_modules\${pathSeparator}${splitLibName.at(0)}\${pathSeparator}${splitLibName.at(1)}\${pathSeparator}dist\${pathSeparator}index.js",
      "args": ["integration", "debug"],
      "sourceMaps": true,
      "resolveSourceMapLocations": [
        "\${workspaceFolder}/**",
        "!**/node_modules/**"
      ],
      "smartStep": true,
      "internalConsoleOptions": "openOnSessionStart"
    }
  ]
}
`;

export const INTEGRATION_VSCODE_SETTINGS = `\
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "integration-debugger.isEnabled": true,
  "integration-debugger.debugConfigurationName": "Debug Integration",
  "integration-debugger.functionNames": {
      "single": ["executePagination", "execute"],
      "series": ["executePagination"]
    }
}
`;

export const INTEGRATION_VSCODE_EXTENSIONS = `\
{
  "recommendations": ["Jokerok.integration-debugger"]
}
`;
