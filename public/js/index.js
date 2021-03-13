"use strict";

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/search" },
  ],
});

const app = new Vue({
  router: router,
}).$mount("#app");
