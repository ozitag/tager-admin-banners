module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['vue.config.js'],
  extends: [
    'plugin:vue/recommended',
    '@vue/prettier/recommended',
    '@vue/prettier/@typescript-eslint',
    '@vue/typescript/recommended',
  ],
  plugins: ['import'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // off this rule, because we have the same rule for Typescript - "@typescript-eslint/no-unused-vars"
    'no-unused-vars': 'off',
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
          {
            pattern: '@tager/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
  },
};
