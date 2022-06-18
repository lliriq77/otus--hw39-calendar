module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "airbnb-base",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "@typescript-eslint/no-var-requires": "off",
    "no-restricted-globals": "off",
    "no-undef": "off",
    "no-use-before-define": "off",
    "no-param-reassign": ["error", { props: false }],
    "no-console": "off",
    "no-alert": "off",
    "import/prefer-default-export": "off",
    "max-len": [
      "error",
      {
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
      },
    ],
    "import/no-unresolved": "off", // https://github.com/typescript-eslint/typescript-eslint/issues/1624
    "import/extensions": ["warn", "never"], // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
  },
  plugins: ["jest", "@typescript-eslint"],
};
