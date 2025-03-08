export const INTEGRATION_TSCONFIG_JSON = `\
{
  "compilerOptions": {
    "target": "ES5",
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

export const INTEGRATION_BABEL_CONFIG = `\
module.exports = {
  sourceType: "unambiguous",
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3.41",
      },
    ],
    "@babel/preset-typescript",
  ],
};
`;

export const INTEGRATION_BROWSERLIST_CONFIG = `\
node >=14
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
 *  @type {import("@infomaximum/package-cli").IntegrationRCConfig}
 */
module.exports = {
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
};
`;

export const INTEGRATION_ENV_EXAMPLE_CONFIG = `\
INTEGRATION_ID=0
GRAPHQL_URL=https://example.com/graphql
API_KEY=123456789qwertyuiop
`;
