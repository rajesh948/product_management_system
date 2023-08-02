import {
  axiosDelete,
  axiosGet,
  axiosPost,
  axiosPut,
} from "@/plugins/axios/axios.plugin";

export const getAllCategory = () => {
  return axiosGet("/category");
};

export const getProductsByCategory = (categoryId: number, queryString = "") => {
  return axiosGet("/product-category/" + categoryId + queryString);
};

export const addProductToCategory = (data: object) => {
  return axiosPost("/product-category/add", data);
};
export const removeProductFromCategory = (data: object) => {
  return axiosPost("/product-category/remove", data);
};

export const createCategory = (categoryData: object) => {
  return axiosPost("/category", categoryData);
};

export const deleteCategory = (categoryId: number) => {
  return axiosDelete("/category/" + categoryId);
};

export const updateCategory = (categoryId: number, categoryData: object) => {
  return axiosPut("/category/" + categoryId, categoryData);
};
