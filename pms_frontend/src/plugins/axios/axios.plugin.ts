import axios from "axios";

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // console.log("plugin response Error ::::", error);

    if (error?.response.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

const apiUrl = process.env.VUE_APP_URL;
export const axiosGet = (url: string, option = {}) => {
  return axios.get(apiUrl + url, option);
};

export const axiosPost = (url: string, data = {}, option = {}) => {
  return axios.post(apiUrl + url, data, option);
};

export const axiosPut = (url: string, data = {}, option = {}) => {
  return axios.put(apiUrl + url, data, option);
};

export const axiosDelete = (url: string, data = {}, option = {}) => {
  return axios.delete(apiUrl + url, { data, ...option });
};
