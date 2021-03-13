<template>
  <div class="editable-text">{{title}}
    <input type="text" v-if="isEdited && !allowedEntries" v-model="currentValue" @keyup.enter="endEdit" />
    <select v-if="isEdited && allowedEntries" v-model="currentValue">
      <option v-for="entry in allowedEntries">{{entry}}</option>
    </select>
    <a v-if="value && !isEdited" :href="url">{{value}}</a>
    <a v-if="!value && !isEdited">{{unknown}}</a>
    <a class="edit" v-if="canEdit && !isEdited" @click="startEdit">(edit)</a>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: null,
    },
    unknown: {
      type: String,
      default: "UNKNOWN",
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    allowedEntries: {
      type: Array,
      default: null,
    },
  },
  data: function() {
    return {
      isEdited: false,
      currentValue: "",
    };
  },
  watch: {
    value: function() {
      this.currentValue = this.value;
    },
    currentValue: function() {
      if (this.allowedEntries) {
        this.endEdit();
      }
    },
  },
  methods: {
    startEdit: function() {
      this.isEdited = true;
    },
    endEdit: function() {
      this.isEdited = false;
      this.$emit("edit", this.currentValue);
    },
  },
};
</script>
