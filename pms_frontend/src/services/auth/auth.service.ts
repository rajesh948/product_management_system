import { axiosGet, axiosPost } from "@/plugins/axios/axios.plugin";

export const userLogin = (userData: object) => {
  return axiosPost("/auth/login", userData);
};
export const getLoginUserData = () => {
  return axiosGet("/auth/get-user-data");
};
export const registerUser = (userData: object) => {
  return axiosPost("/auth/register", userData);
};
