module.exports = {
  root: true,
  env: {
    node: true
  },
  ignorePatterns: ['vue.config.js'],
  extends: [
    'plugin:vue/recommended',
    '@vue/typescript/recommended',
    '@vue/prettier/recommended',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // off this rule, because we have the same rule for Typescript - "@typescript-eslint/no-unused-vars"
    'no-unused-vars': 'off'
  }
};
