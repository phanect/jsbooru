
<template>
  <div id="content">
    <section id="search">
      <h2>{{count}} results</h2>
      <page-box :pageCount="20" :start="pos" :count="count" :currTags="currTags" />
      <image-thumbnail v-for="image in images" :image="image" />
      <page-box :pageCount="20" :start="pos" :count="count" :currTags="currTags" />
    </section>
    <aside>
      <search-box @select="setRequest" :current="currTags"></search-box>
      <sidebar-tags @select="addTag" :tags="tags"></sidebar-tags>
    </aside>
  </div>
</template>

<script>
export default {
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
      this.$router.push("/search?q=" + this.currTags);
    },
  },
};
</script>
