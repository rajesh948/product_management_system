import {
  axiosDelete,
  axiosGet,
  axiosPost,
  axiosPut,
} from "@/plugins/axios/axios.plugin";

export const getAllProduct = (queryString = "") => {
  return axiosGet("/product" + queryString);
};
export const addProduct = (productObject: object) => {
  return axiosPost("/product", productObject);
};

export const deleteProduct = (productId: number) => {
  return axiosDelete("/product/" + productId);
};
export const updateProduct = (productId: number, productObject: object) => {
  return axiosPut("/product/" + productId, productObject);
};
