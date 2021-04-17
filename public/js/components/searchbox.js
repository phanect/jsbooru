"use strict";

Vue.component("search-box", {
  components: {
    autocomplete: Vue2Autocomplete,
  },
  props: {
    current: String,
  },
  methods: {
    formatData: function(data) {
      return (
        `<div class="reply">
          <span class="title tag ${data.type}">${data.name}</span>
          <span class="count">(${data.count})</span>
        </div>`
      );
    },
    processData: function(data) {
      return data.sort((d1, d2) => {
        if (d1.count > d2.count) {
          return -1;
        }
        if (d1.count < d2.count) {
          return 1;
        }
        return 0;
      });
    },
    getData: function(tag) {
      this.$emit("select", tag.result);
    },
  },
  template: "#searchbox-template",
});
