import axiosClient from "./axiosClient";

export const handleBrandAPI = async (
  url: string,
  data?: any,
  method?: "post" | "put" | "get" | "delete"
) => {
  return await axiosClient(`/brands${url}`, {
    headers: {},
    method: method ?? "get",
    data,
  });
};
