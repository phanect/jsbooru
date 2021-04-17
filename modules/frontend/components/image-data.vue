<template>
  <section id="infos">
    <h2>Infos</h2>
    <editable-text
      unknown="none"
      title="Rating: " :value="image.rating"
      :allowedEntries="['safe', 'questionnable', 'explicit']"
      :canEdit="true" @edit="editRating"
    />
    <editable-text
      unknown="UNKNOWN"
      title="Source: " :value="image.source"
      :url="image.source"
      :canEdit="true" @edit="editSource"
    />
    <editable-text
      unknown="UNKNOWN"
      title="Uploader: " :value="image.user"
      :url="'/user/' + image.user"
      :canEdit="true" @edit="editUser"
    />
    <div><a :href="image.url" target="_blank">Download picture</a></div>
  </section>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      default: {},
    },
  },
  methods: {
    editRating: function(value) {
      this.$emit("editRating", value);
    },
    editUser: function(value) {
      this.$emit("editUser", value);
    },
    editSource: function(value) {
      this.$emit("editSource", value);
    },
  },
};
</script>
