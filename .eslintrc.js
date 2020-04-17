"use strict";

module.exports = {
  root: true,
  extends: "plugin:@phanect/plain",

  env: {
    browser: true,
    node: true,
  },
  plugins: [ "@phanect" ],

  overrides: [
    {
      files: [ "src/**/*.js" ],
      extends: "plugin:@phanect/node",
      env: {
        browser: false,
        node: true,
      },
    },
    {
      files: [ "modules/frontend/**/*.vue", "modules/frontend/**/*.js" ],
      extends: [
        "plugin:@phanect/vue",
        "plugin:nuxt/recommended",
      ],
      parserOptions: {
        sourceType: "module",
      },
      plugins: [ "nuxt" ],
    },
  ],
};
