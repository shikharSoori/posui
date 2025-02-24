import axiosInstance from "../../../Utils/axios";

// obtaining the paginated data
export const getProduct = (postsPerPage) =>
  axiosInstance.get(
    `api/v1/products-app/products/list?limit=${postsPerPage}&ordering=-id`
  );

//obtaining all data
export const getAllProduct = () =>
  axiosInstance.get(
    `api/v1/core-app/products-app/products/list-all?ordering=-id`
  );
