import { getUserRole } from "@/util";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export const pageGard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  return localStorage.getItem("token") ? next() : next({ name: "login" });
};
export const adminGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (getUserRole() !== "user" && localStorage.getItem("token")) {
    return next();
  }
  return next({ name: "home" });
};

export const loginAndRegistrationGard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  return localStorage.getItem("token") ? next({ name: "home" }) : next();
};
