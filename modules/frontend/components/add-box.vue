<template>
  <section id="addbox">
    <h2>Add tag</h2>
    <autocomplete
      url="/api/tags"
      params="q"
      anchor="result"
      :process="processData"
      :min="1"
      :debounce="250"
      :template="formatData"
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
    processData: (data) => {
      data.sort((d1, d2) => {
        if (d1.count > d2.count) {
          return -1;
        }
        if (d1.count < d2.count) {
          return 1;
        }
        return 0;
      });
      if(data[0].match) {
        const original = data[0].query.split(" ").pop();
        data.push({
          count: 0,
          match: false,
          name: original,
          query: data[0].query,
          result: original,
        });
      }
      return data;
    },
    formatData: function(data) {
      if(data.match) {
        return (
          `<div class="reply">
            <span class="title tag ${data.type}">${data.name}</span>
            <span class="count">(${data.count})</span>
          </div>`);
      }
      return (
        `<div class="reply">
          <span class="title">${data.query}</span>
          <span class="count">create</span>
        </div>`);
    },
    getData: function(tag) {
      this.$emit("select", tag.result);
    },
  },
};
</script>

<style src="~/assets/styles/vue2-autocomplete.css" scoped></style>
