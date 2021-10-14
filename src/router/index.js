import { createRouter, createWebHistory } from "vue-router";
import { defineAsyncComponent } from "vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: defineAsyncComponent(() => import("@/views/About.vue")),
  },
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
