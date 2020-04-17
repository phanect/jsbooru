"use strict";

Vue.component("sidebar-tags", {
  props: {
    allowDelete: Boolean,
    tags: Array,
  },
  methods: {
    searchTag: function(tagName) {
      this.$emit("select", String(tagName));
    },
    deleteTag: function(tagName) {
      this.$emit("delete", String(tagName));
    },
  },
  template: "#sidebar-tags-template",
});
