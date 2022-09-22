import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [    
    {
      path: "/",
      name: "App",
      component: () => import("../components/HomePage.vue")
    },    
    { 
      path: "/funciones",
      name: "funcionesPage",
      component: () => import("../components/FuncionesPage.vue")
    },
    
  ],
});

export default router;