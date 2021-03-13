"use strict";

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/search" },
  ],
});

Vue.http.options.root = "/api";

const app = new Vue({
  router: router,
}).$mount("#app");
