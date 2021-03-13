<template>
  <div id="content">
    <section id="image">
      <img v-if="image" :src="image.url" :class="{ limit: limitSize }" @click="toggleSizeLimit" />
    </section>
    <aside>
      <search-box @select="setRequest"></search-box>
      <sidebar-tags @select="setRequest" @delete="deleteTag" :tags="tags" :allowDelete="true"></sidebar-tags>
      <add-box @select="addTag"></add-box>
      <image-data v-if="image" :image="image"
        @editRating="editRating"
        @editUser="editUser"
        @editSource="editSource">
      </image-data>
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
  created: function(to, from) {
    this.init();
  },
  methods: {
    init: function() {
      this.id = this.$route.params.id;
      this.selectImage();
    },
    selectImage: function() {
      const self = this;
      this.$http.get("image/" + this.id)
        .then((response) => {
          self.image = response.body;
          self.tags = response.body.tags.sort((a, b) => {
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
          return;
        }).then(undefined, (error) => {
          console.warn(error);
        });
    },
    setRequest: function(request) {
      this.$router.push("/search?q=" + request);
    },
    addTag: function(tags) {
      const self = this;
      const tag = tags.trim().split(" ").pop();
      if(confirm("Add the tag '" + tag + "' to this picture ?")) {
        this.$http.post("image/" + this.id + "/" + tag)
          .then((reply) => {
            self.selectImage();
          });
      }
    },
    deleteTag: function(tagName) {
      const self = this;
      if(confirm("Delete the tag '" + tagName + "' from this picture ?")) {
        this.$http.delete("image/" + this.id + "/" + tagName)
          .then((reply) => {
            self.selectImage();
            return;
          });
      }
    },
    editRating: function(value) {
      if (confirm("Set the rating to '" + value + "' ?")) {
        this.setImageValue("rating", value);
      }
    },
    editUser: function(value) {
      if (confirm("Set the uploader to '" + value + "' ?")) {
        this.setImageValue("user", value);
      }
    },
    editSource: function(value) {
      if (confirm("Set the source to '" + value + "' ?")) {
        this.setImageValue("source", value);
      }
    },
    setImageValue: function(name, value) {
      const self = this;
      const data = {};
      data[name] = value;
      this.$http.post("image/" + this.id, data)
        .then((reply) => {
          self.selectImage();
          return;
        });
    },
    toggleSizeLimit: function() {
      this.limitSize = !this.limitSize;
    },
  },
};
</script>
