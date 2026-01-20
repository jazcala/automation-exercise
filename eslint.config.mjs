import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import checkFile from "eslint-plugin-check-file";
import playwright from "eslint-plugin-playwright";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "check-file": checkFile,
      playwright: playwright,
    },
    rules: {
      quotes: [
        "error",
        "single",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      semi: ["error", "always"],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "lines-between-class-members": [
        "error",
        "always",
        { exceptAfterSingleLine: true },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "method", format: ["camelCase"] },
        { selector: "function", format: ["camelCase"] },
        {
          selector: ["class", "interface", "typeAlias"],
          format: ["PascalCase"],
        },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["UPPER_CASE", "camelCase"],
        },
        {
          selector: ["variable", "parameter"],
          format: ["camelCase"],
        },
        {
          selector: "variable",
          modifiers: ["unused"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
      ],
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "**/*/": "KEBAB_CASE",
        },
      ],
      ...playwright.configs["recommended"].rules,
      "playwright/no-skipped-test": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off", // Turn off default to let TS handle it
      "no-unreachable": "error",
    },
  },

  {
    files: ["tests/api/**/*.spec.ts", "tests/visual/**/*.spec.ts"],
    plugins: {
      playwright: playwright,
    },
    rules: {
      // Enforce that titles must contain the specific tag
      "playwright/valid-title": [
        "error",
        {
          mustMatch: {
            describe: [
              "@api|@visual",
              "Standard QA Alert: Describe blocks in this folder must include the '@api' or '@visual' tag.",
            ],
          },
        },
      ],
      "playwright/valid-test-tags": "error",
    },
  },
  {
    ignores: ["test-results/", "playwright-report/", "dist/", "node_modules/"],
  },
];
