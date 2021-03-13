<template>
  <section id="searchbox">
    <h2>Search</h2>
    <autocomplete
      url="/api/tags"
      params="q"
      anchor="result"
      :min="1"
      :process="processData"
      :debounce="250"
      :template="formatData"
      :initValue="current"
      :on-select="getData">
    </autocomplete>
  </section>
</template>

<script>
import Vue2Autocomplete from "vue2-autocomplete-js";

export default {
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
};
</script>

<style src="~/assets/styles/vue2-autocomplete.css" scoped></style>
