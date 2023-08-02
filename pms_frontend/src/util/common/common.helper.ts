import { store } from "@/store";
import moment from "moment";

export const getRupeeFormat = (amount: number) => {
  const rupee = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return rupee.format(amount);
};

export const getDateFormat = (date: Date) => {
  return moment(date).format("llll");
};

export const getUserRole = () => {
  const user = store.getters["auth/getUserData"];
  if (!user) {
    const interval = setTimeout(() => {
      getUserRole();
    }, 300);
    clearTimeout(interval);
  } else {
    return user.role.title;
  }
};

export const isUserAccessible = (permission: string) => {
  return store.getters["auth/checkUserPermission"](permission);
};

export const getImageLink = (image: string) => `http://localhost:3000/${image}`;
