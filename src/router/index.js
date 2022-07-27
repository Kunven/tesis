import { createRouter, createWebHistory } from "vue-router";
//import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [    
    {
      path: "/a",
      name: "App",
      component: () => import("../App.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../components/LoginForm.vue"),
    },    
    {
      path: "/register",
      name: "register",
      component: () => import ("../components/RegisterPage.vue"),
    }
  ],
});

export default router;
