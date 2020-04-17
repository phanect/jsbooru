"use strict";

Vue.component("image-thumbnail", {
  props: {
    image: Object,
  },
  methods: {
    selectImage: function() {
      this.$emit("select", String(this.image.id));
    },
  },
  template: "#thumbnail-template",
});
