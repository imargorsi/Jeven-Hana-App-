import { defineConfig, globalIgnores } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  expoConfig,
  {
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
        node: true,
      },
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
          ],
          "newlines-between": "always",
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  { files: ["**/*.ts", "**/*.tsx"], rules: { "no-undef": "off" } },
  {
    files: ["scripts/**/*.js", "metro.config.js", "app.config.js"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
  },
  eslintConfigPrettier,
  globalIgnores([
    "node_modules/**",
    ".expo/**",
    "dist/**",
    "web-build/**",
    "Mobile/**",
    "Backend/**",
  ]),
]);
