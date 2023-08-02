import {
  axiosDelete,
  axiosGet,
  axiosPost,
  axiosPut,
} from "@/plugins/axios/axios.plugin";

export const createRole = (roleData: object) => {
  return axiosPost("/role", roleData);
};

export const deleteRole = (roleId: number) => {
  return axiosDelete("/role/" + roleId);
};

export const updateRole = (roleId: number, roleData: object) => {
  return axiosPut("/role/" + roleId, roleData);
};
export const getAllRole = () => {
  return axiosGet("/role");
};
export const getAllPermission = () => {
  return axiosGet("/permission");
};
export const assignPermissionToRole = (params: object) => {
  return axiosPost("/role-permission/assign", params);
};
export const removePermissionToRole = (params: object) => {
  return axiosPost("/role-permission/remove", params);
};
