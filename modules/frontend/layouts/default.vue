<template>
  <div id="app">
    <header id="header">
      <h1>{{ title }}</h1>
      <nav>
        <menu class="main">
          <ul>
            <li><router-link to="/search">Posts</router-link></li>
            <li><router-link to="/upload">Upload</router-link></li>
          </ul>
        </menu>
      </nav>
    </header>
    <Nuxt />
    <footer id="footer">
      <div>
        Powered by <a href="//github.com/dexesttp/jsbooru">JSBooru</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: "Museum",
  }),
};
</script>
