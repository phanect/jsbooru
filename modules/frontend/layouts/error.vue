<template>
  <div>
    <h1>
      {{ error.message }}
    </h1>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
}
</script>
