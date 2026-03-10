import AuthLayout from "@/layouts/AuthLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/dashboard",
      name: "Dashboard",
      component: MainLayout,
      children: [
        {
          path: "",
          component: DashboardPage,
        },
      ],
    },
    {
      path: "/",
      component: AuthLayout,
      children: [
        {
          path: "",
          component: LoginPage,
        },
      ],
    },
  ],
});

export default router;
