<template>
  <section id="tags">
    <h2>Tags</h2>
    <ul>
      <li v-for="tag in tags">
        <router-link :class="['name', 'tag', tag.type]"  :to="'/search?q=' + tag.name">
          {{tag.name}}
        </router-link>
        <span :class="['post-count', 'tag', tag.type]">{{tag.count}}</span>
        <a v-if="allowDelete" class="delete" @click="deleteTag(tag.name)">-</a>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
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
};
</script>
