"use strict";

Vue.component("image-data", {
  props: {
    image: {
      type: Object,
      default: {},
    },
  },
  methods: {
    editRating: function(value) {
      this.$emit("editRating", value);
    },
    editUser: function(value) {
      this.$emit("editUser", value);
    },
    editSource: function(value) {
      this.$emit("editSource", value);
    },
  },
  template: "#image-data-template",
});
