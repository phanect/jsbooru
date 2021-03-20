<template>
  <div id="content">
    <section id="image">
      <img v-if="image" :src="image.url" :class="{ limit: limitSize }" @click="toggleSizeLimit">
    </section>
    <aside>
      <search-box @select="setRequest" />
      <sidebar-tags :tags="tags" :allowDelete="true" @select="setRequest" @delete="deleteTag" />
      <add-box @select="addTag" />
      <image-data
        v-if="image" :image="image"
        @editRating="editRating"
        @editUser="editUser"
        @editSource="editSource"
      />
    </aside>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      id: "",
      image: null,
      tags: [],
      limitSize: true,
    };
  },
  watch: {
    $route: function(to, from) {
      if (from !== to) {
        this.init();
      }
    },
  },
  async created(to, from) {
    await this.init();
  },
  methods: {
    async init() {
      this.id = this.$route.params.id;
      await this.selectImage();
    },
    async selectImage() {
      try {
        const res = await fetch(`/api/image/${this.id}`);

        this.image = await res.json();
        this.tags = this.image.tags.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      } catch(error) {
        console.warn(error);
      }
    },
    setRequest: function(request) {
      this.$router.push("/search?q=" + request);
    },
    async addTag(tags) {
      const tag = tags.trim().split(" ").pop();
      if(confirm("Add the tag '" + tag + "' to this picture ?")) {
        await fetch(`/api/image/${this.id}/${tag}`, {
          method: "POST",
        });
        this.selectImage();
      }
    },
    async deleteTag(tagName) {
      if(confirm("Delete the tag '" + tagName + "' from this picture ?")) {
        await fetch(`/api/image/${this.id}/#{tagName}`, {
          method: "DELETE",
        });
        this.selectImage();
      }
    },
    async editRating(value) {
      if (confirm("Set the rating to '" + value + "' ?")) {
        await this.setImageValue("rating", value);
      }
    },
    async editUser(value) {
      if (confirm("Set the uploader to '" + value + "' ?")) {
        await this.setImageValue("user", value);
      }
    },
    async editSource(value) {
      if (confirm("Set the source to '" + value + "' ?")) {
        await this.setImageValue("source", value);
      }
    },
    async setImageValue(name, value) {
      const data = {};
      data[name] = value;
      await fetch("/api/image/" + this.id, {
        method: "POST",
        body: JSON.stringify(data),
      });
      this.selectImage();
    },
    toggleSizeLimit: function() {
      this.limitSize = !this.limitSize;
    },
  },
};
</script>
