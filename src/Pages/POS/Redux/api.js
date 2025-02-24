import axiosInstance from "../../../Utils/axios";

// obtaining the paginated data
export const getProduct = (postsPerPage) =>
  axiosInstance.get(`api/v1/products-app/products/list`);

//obtaining all data
export const getAllProduct = () =>
  axiosInstance.get(
    `api/v1/core-app/products-app/products/list-all?ordering=-id`
  );

export const createInvoice = (data) =>
  axiosInstance.post(`api/v1/sales-app/sales-invoice/direct/create`, data);

export const getDayBook = () =>
  axiosInstance.get(`api/v1/sales-app/sales-invoice/direct/list`);