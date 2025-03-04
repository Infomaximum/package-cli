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
node 0.5
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
`