<template>
  <div id="content">
    <section id="image">
      <img v-if="image" :src="image.url" :class="{ limit: limitSize }" @click="toggleSizeLimit">
    </section>
    <aside>
      <search-box @select="setRequest" />
      <sidebar-tags :tags="image.tags" :allowDelete="true" @select="setRequest" @delete="deleteTag" />
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
import { getEndpoint } from "~/libs/utils.js";

export default {
  async asyncData({ route, error }) {
    const res = await fetch(`${getEndpoint()}/api/image/${route.params.id}`);

    if (res.status === 200) {
      return {
        id: route.params.id,
        image: await res.json(),
      }
    } else if (res.status === 404) {
      error({
        statusCode: 404,
        message: "The file is not found.",
      });
    } else {
      error({
        statusCode: 500,
        message: "Sorry, something technically wrong.",
      });
    }
  },
  data: function() {
    return {
      limitSize: true,
    };
  },
  methods: {
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
