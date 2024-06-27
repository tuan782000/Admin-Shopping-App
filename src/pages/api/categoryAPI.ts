import axiosClient from "./axiosClient";

// liên quan tới authen thì gọi vào đây

export const handleCategoryAPI = async (
  url: string,
  data?: any,
  method?: "post" | "put" | "get" | "delete"
) => {
  return await axiosClient(`/categories${url}`, {
    headers: {},
    method: method ?? "get",
    data,
  });
};
