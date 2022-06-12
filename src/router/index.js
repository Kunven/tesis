import { createRouter, createWebHistory } from "vue-router";
//import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [    
    {
      path: "/login",
      name: "login",
      component: () => import("../components/LoginPage.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../components/MainApp.vue"),
    },
  ],
});

export default router;
