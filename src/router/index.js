import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [    
    {
      path: "/a",
      name: "App",
      component: () => import("../components/MainApp.vue")
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
    },
    {
      path: "/home",
      name: "home",
      component: () => import ("../components/HomePage.vue"),
    },
    {
      path: "/consultas",
      name: "consultas",
      component: () => import ("../components/MenuConsultas.vue"),
    },
  ],
});

export default router;
