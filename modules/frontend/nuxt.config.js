export default {
  head: {
    title: "Museum ― a package manager for assets",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
  },

  components: true,
  modern: "client",

  build: {
    babel: {
      presets(_, [ preset, options ]) {
        options.polyfills = [];
      },
    },
  },

  css: [
    "~/assets/styles/style.css",
    "~/assets/styles/theme.css",
  ],
  server: {
    port: 3002,
  },
};
