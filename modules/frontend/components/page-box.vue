<template>
  <nav class="pages">
    <ul>
      <li v-for="page in pages" :class="{ selected: page.selected }">
        <router-link :to="'/search?s=' + page.value + '&q=' + currTags">
          {{ page.identifier }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    start: {
      default: 0,
      type: Number,
    },
    pageCount: {
      default: 20,
      type: Number,
    },
    count: {
      default: 0,
      type: Number,
    },
    currTags: String,
  },
  computed: {
    pages: function() {
      const arrayCount = Math.ceil(this.count / this.pageCount);
      const array = [];
      let curr = 0;
      while(curr < arrayCount) {
        const value = curr*this.pageCount;
        array.push({
          identifier: curr+1,
          value: value,
          selected: (this.start <= value && value < this.start + this.pageCount),
        });
        curr++;
      }
      return array;
    },
  },
};
</script>
