"use strict";

const Search = Vue.component("main-wiki", {
  data: function() {
    return {
      name: "",
      type: "no-type",
      count: 0,
      entries: [],
    };
  },
  watch: {
    "$route.query.q": function(to, from) {
      if (to !== from) {
        this.init();
      }
    },
    "$route.query.s": function(to, from) {
      if (to !== from) {
        this.init();
      }
    },
  },
  created: function(to, from) {
    this.init();
  },
  methods: {
    init: function() {
      this.name = this.$route.params.name;
      this.getData();
    },
    getData: function() {
      const self = this;
      this.$http.get("wiki/tag/" + this.name)
        .then((response) => {
          self.type = response.body.type;
          self.count = response.body.count;
          self.entries = response.body.wiki;
        }).then(undefined, (response) => {
          console.warn("Request failed on tag wiki");
        });
    },
    setRequest: function(request) {
      router.push("/search?q=" + request);
    },
    editType: function(type) {
      const self = this;
      this.$http.post("tag/" + this.name + "/" + type)
        .then((reply) => {
          self.getData();
        });
    },
  },
  template: "#wiki-template",
});
