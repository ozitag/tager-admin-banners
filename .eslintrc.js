require("@rushstack/eslint-patch/modern-module-resolution");

const allExtensions = [".ts", ".tsx", ".js", ".jsx", ".vue"];

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/eslint-config-typescript/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier", "import"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  settings: {
    "import/extensions": allExtensions,
    "import/external-module-folders": ["node_modules", "node_modules/@types"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      node: {
        extensions: allExtensions,
      },
    },
  },
  rules: {
    "prettier/prettier": "warn",
    "import/extensions": [
      "warn",
      "ignorePackages",
      { js: "always", ts: "never", vue: "always" },
    ],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // off this rule, because we have the same rule for Typescript - "@typescript-eslint/no-unused-vars"
    "no-unused-vars": "off",
    "import/order": [
      "error",
      {
        pathGroups: [
          {
            pattern: "@/**",
            group: "internal",
          },
          {
            pattern: "@tager/**",
            group: "external",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: [],
        "newlines-between": "always",
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["*.stories.ts"],
      rules: {
        "vue/one-component-per-file": "off",
      },
    },
  ],
};
