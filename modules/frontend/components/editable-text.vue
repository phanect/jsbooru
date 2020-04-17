"use strict";

Vue.component("editable-text", {
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

  template: "#editable-text-template",
});
