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
      path:"/permisos",
      name: "permisos",
      component: () => import ("../components/PermisosRol.vue")
    },
    {
      path: "/passwordReset",
      name: "passReset",
      component: () => import ("../components/PasswordReset.vue"),
    },
    {
      path: "/registerDoc",
      name: "registerDoc",
      component: () => import ("../components/RegisterPageDoc.vue"),
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
    {
      path: "/fichas",
      name: "fichas",
      component: () => import ("../components/FichasMedicas.vue"),
    },
    {
      path: "/usuario",
      name: "usuario",
      component: () => import ("../components/MiUsuario.vue")
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import ("../components/UserAdmin.vue")
    }
  ],
});

export default router;
