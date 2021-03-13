export default {
  head: {
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

  css: [
    "~/assets/styles/style.css",
    "~/assets/styles/theme.css",
  ],
};