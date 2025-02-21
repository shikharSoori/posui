import axiosInstance, { publicAxiosInstance } from "../../Utils/axios";

//for login
export const login = (body) => publicAxiosInstance.post(`api/v1/user-app/login`, body);
//for logout
export const logout = (body) => axiosInstance.post(`api/v1/user-app/logout`, body);

//for reset password

export const verifySignature = (body) => publicAxiosInstance.post(`api/v1/user-app/verify_singature`, body);

export const changePassword = (id, body) => axiosInstance.patch(`api/v1/user-app/change-password/${id}`, body);

export const forgetPassword = (body) => publicAxiosInstance.post(`api/v1/user-app/forget-password`, body);

export const resetPassword = (otp, body) => publicAxiosInstance.post(`api/v1/user-app/reset-password/${otp}`, body);
