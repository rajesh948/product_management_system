import {
  axiosDelete,
  axiosGet,
  axiosPost,
  axiosPut,
} from "@/plugins/axios/axios.plugin";

export const getAllUser = () => {
  return axiosGet("/user");
};
export const updateUserInfo = (userId: number, userData: object) => {
  return axiosPut("/user/" + userId, userData);
};

export const removeUser = (userId: number) => {
  return axiosDelete("/user/" + userId);
};
export const assignPermissionToUser = (params: object) => {
  return axiosPost("/user-permission/assign", params);
};
export const removePermissionFromUser = (params: object) => {
  return axiosPost("/user-permission/remove", params);
};
