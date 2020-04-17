"use strict";

const Search = Vue.component("main-search", {
  data: function() {
    return {
      currTags: "",
      pos: 0,
      count: 0,
      images: [],
      tags: [],
      loaded: false,
    };
  },
  computed: {

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
      this.currTags = this.$route.query.q || "";
      this.pos = +(this.$route.query.s || "");
      this.getItems();
    },
    getItems: function() {
      const self = this;
      this.$http.get("image", { params: { s: this.pos, q: this.currTags }})
        .then((response) => {
          self.count = response.body.count;
          self.images = response.body.result.map((image) => ({
            id: image._id,
            link: "/view/" + image._id,
            thumbnail: image.thumbnail || image.url,
            tags: image.tags ? image.tags.join(" ") : "",
          }));
          self.tags = response.body.tags.sort((a, b) => {
            const nameA = a.name;
            const nameB = b.name;
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          return;
        }).then(undefined, (response) => {
          console.warn("Request failed on image list get");
        });
    },
    setRequest: function(request) {
      this.currTags = request.trim();
      this.goTo();
    },
    addTag: function(tag) {
      this.currTags = (tag).trim();
      this.goTo();
    },
    goTo: function() {
      router.push("/search?q=" + this.currTags);
    },
  },
  template: "#search-template",
});
