import axiosClient from "./axiosClient";

export const handlePromoCodeAPI = async (
  url: string,
  data?: any,
  method?: "post" | "put" | "get" | "delete"
) => {
  return await axiosClient(`/promoCodes${url}`, {
    headers: {},
    method: method ?? "get",
    data,
  });
};
