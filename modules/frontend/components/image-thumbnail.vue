<template>
  <article
    :id="'post_' + image.id"
    class="post-preview"
    itemscope
    itemtype="http://schema.org/ImageObject"
    :data-id="image.id">
    <router-link :to="'/view/' + image.id">
      <img
        itemprop="thumbnailUrl"
        :src="image.thumbnail"
        :alt="image.tags"
        :title="image.tags"
      >
    </router-link>
  </article>
</template>

<script>
export default {
  props: {
    image: Object,
  },
  methods: {
    selectImage: function() {
      this.$emit("select", String(this.image.id));
    },
  },
};
</script>
