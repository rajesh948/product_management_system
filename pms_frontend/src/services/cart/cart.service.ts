import { axiosGet, axiosPost } from "@/plugins/axios/axios.plugin";

export const addProductToCart = (productId: number) => {
  return axiosPost("/product-cart/add/" + productId);
};

export const removeProductFromCart = (productId: number) => {
  return axiosPost("/product-cart/remove/" + productId);
};

export const getMyCartProduct = () => {
  return axiosGet("/product-cart");
};

export const checkoutCart = () => {
  return axiosPost("/checkout");
};

export const purchaseHistory = () => {
  return axiosGet("/purchase-history");
};
