import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  paramsSerializer: (params) => queryString.stringify(params),
  baseURL: "http://localhost:3001",
});

axiosClient.interceptors.request.use(async (config: any) => {
  config.headers = {
    Authorization: "",
    Accept: "application/json",
    ...config.headers,
  };

  config.data;

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  },
  (error) => {
    console.log(error);
    console.log(error.message);
    throw new Error(error.message);
  }
);

export default axiosClient;
