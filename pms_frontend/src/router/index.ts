import { createRouter, createWebHistory } from "vue-router";
import authLoginPage from "@/pages/auth/auth-login-page.vue";
import authRegisterPage from "@/pages/auth/auth-register-page.vue";
import profilePage from "@/pages/auth/auth-profile-page.vue";
import homePage from "@/pages/home/home-page.vue";
import cartPage from "@/pages/cart/cart-page.vue";
import purchasedHistoryPage from "@/pages/purchase/purchase-history-page.vue";
import adminDashboardPage from "@/pages/admin/dashboard/admin-dashboard-page.vue";
import userPanel from "@/pages/admin/panels/user-panel-page.vue";
import rolePanel from "@/pages/admin/panels/role-panel-page.vue";
import productPanel from "@/pages/admin/panels/product-panel-page.vue";
import categoryPanel from "@/pages/admin/panels/category-panel-page.vue";
import notFoundPage from "@/pages/not-found/not-found-page.vue";
import {
  adminGuard,
  loginAndRegistrationGard,
  pageGard,
} from "./routerGuard/router.guard";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "home",
      path: "/",
      component: homePage,
    },
    {
      name: "login",
      path: "/login",
      component: authLoginPage,
      beforeEnter: loginAndRegistrationGard,
    },
    {
      name: "register",
      path: "/register",
      component: authRegisterPage,
      beforeEnter: loginAndRegistrationGard,
    },
    {
      name: "profile",
      path: "/profile",
      component: profilePage,
      beforeEnter: pageGard,
    },
    {
      name: "cart",
      path: "/view-cart",
      component: cartPage,
      beforeEnter: pageGard,
    },
    {
      name: "purchaseHistory",
      path: "/purchase-history",
      component: purchasedHistoryPage,
      beforeEnter: pageGard,
    },
    {
      name: "admin",
      path: "/admin",
      component: adminDashboardPage,
      children: [
        { path: "/admin/user", name: "userPanel", component: userPanel },
        { path: "/admin/role", name: "rolePanel", component: rolePanel },
        {
          path: "/admin/product",
          name: "productPanel",
          component: productPanel,
        },
        {
          path: "/admin/category",
          name: "categoryPanel",
          component: categoryPanel,
        },
      ],
      beforeEnter: adminGuard,
    },
    {
      name: "pageNotFound",
      path: "/:pageNotFound(.*)*",
      redirect: { name: "404" },
    },
    {
      name: "404",
      path: "/404",
      component: notFoundPage,
    },
  ],
});
