import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [    
    {
      path: "/test",
      name: "App",
      component: () => import("../components/HomePage.vue")
    },    
  ],
});

export default router;