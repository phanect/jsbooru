
<template>
  <div id="content">
    <section id="search">
      <h2>{{ count }} results</h2>
      <page-box :pageCount="20" :start="pos" :count="count" :currTags="currTags" />
      <image-thumbnail v-for="image in images" :key="image.url" :image="image" />
      <page-box :pageCount="20" :start="pos" :count="count" :currTags="currTags" />
    </section>
    <aside>
      <search-box :current="currTags" @select="setRequest" />
      <sidebar-tags :tags="tags" @select="addTag" />
    </aside>
  </div>
</template>

<script>
import { getEndpoint } from "~/libs/utils.js";

const getItems = async (pos, currTags) => {
  const url = `${getEndpoint()}/api/image?s=${pos}&q=${currTags}`;
  console.info(`GET: ${url}`);
  const res = await fetch(url);
  const { count, tags, result } = await res.json();

  return {
    count,
    tags,
    images: result.map((image) => ({
      id: image._id,
      link: "/view/" + image._id,
      thumbnail: image.thumbnail || image.url,
      tags: image.tags ? image.tags.join(" ") : "",
    })),
  };
};

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
  async fetch() {
    const { route, error } = this.$nuxt.context;

    try {
      this.currTags = route.query.q || "";
      this.pos = +(route.query.s || "");

      const { count, tags, images } = await getItems(this.pos, this.currTags);

      this.count = count;
      this.tags = tags;
      this.images = images;
    } catch (err) {
      console.error(err);
      error({
        statusCode: 500,
        message: "Sorry, something technically wrong.",
      });
    }
  },
  watch: {
    "$route.query.q": async function(to, from) {
      if (to !== from) {
        await this.$fetch();
      }
    },
    "$route.query.s": async function(to, from) {
      if (to !== from) {
        await this.$fetch();
      }
    },
  },
  methods: {
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
