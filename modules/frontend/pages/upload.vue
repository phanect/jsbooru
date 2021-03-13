<template>
  <div id="content">
    <section id="upload">
      <form action="/api/image" method="post" enctype="multipart/form-data">
        <input type="file" name="image" />
        <input type="submit" value="upload" />
      </form>
    </section>
    <aside>
      Uploading picture...
    </aside>
  </div>
</template>

<script>
export default {
};
</script>
