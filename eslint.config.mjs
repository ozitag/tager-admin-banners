import js from "@eslint/js";
import globals from "globals";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import importPlugin from "eslint-plugin-import";
import pluginVue from "eslint-plugin-vue";
// Отключает правила ESLint, конфликтующие с prettier. Сам prettier из линтера
// убран: форматирование запускается отдельно (`yarn format`), как рекомендуют
// его мейнтейнеры, и не смешивается с ошибками линтера.
import prettierSkipFormatting from "eslint-config-prettier/flat";

const allExtensions = [".ts", ".tsx", ".js", ".jsx", ".vue"];

export default defineConfigWithVueTs(
  {
    ignores: ["dist/**", "node_modules/**", "public/**"],
  },
  js.configs.recommended,
  {
    // соответствует прежнему env: { node: true }
    languageOptions: { globals: { ...globals.node } },
  },
  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  prettierSkipFormatting,
  {
    // плагин подключён ради import/order и import/extensions; набор
    // import/recommended намеренно не включаем — его тут никогда не было,
    // и он спотыкается о .vue, которые eslint-plugin-import не парсит
    plugins: { import: importPlugin },
    settings: {
      "import/extensions": allExtensions,
      "import/external-module-folders": ["node_modules", "node_modules/@types"],
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        // пакеты @tager/* — ESM с картой exports, legacy-резолвер их не находит
        typescript: { alwaysTryTypes: true },
        node: {
          extensions: allExtensions,
        },
      },
    },
    rules: {
      "import/extensions": [
        "warn",
        "ignorePackages",
        { js: "always", ts: "never", vue: "always" },
      ],
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      // дублирует @typescript-eslint/no-unused-vars
      "no-unused-vars": "off",
      "import/order": [
        "error",
        {
          pathGroups: [
            { pattern: "@/**", group: "internal" },
            { pattern: "@tager/**", group: "external", position: "after" },
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
  },
  {
    files: ["**/*.stories.ts"],
    rules: {
      "vue/one-component-per-file": "off",
    },
  }
);
