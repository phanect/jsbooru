
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
    "$route.query.q": async function(to, from) {
      if (to !== from) {
        await this.init();
      }
    },
    "$route.query.s": async function(to, from) {
      if (to !== from) {
        await this.init();
      }
    },
  },
  async created(to, from) {
    await this.init();
  },
  methods: {
    async init() {
      this.currTags = this.$route.query.q || "";
      this.pos = +(this.$route.query.s || "");
      await this.getItems();
    },
    async getItems() {
      try {
        const res = await fetch(`/api/image?s=${this.pos}&q=${this.currTags}`);
        const { count, result, tags } = await res.json();

        this.count = count;
        this.images = result.map((image) => ({
          id: image._id,
          link: "/view/" + image._id,
          thumbnail: image.thumbnail || image.url,
          tags: image.tags ? image.tags.join(" ") : "",
        }));
        this.tags = tags.sort((a, b) => {
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
      } catch (err) {
        console.warn("Request failed on image list get");
      }
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
