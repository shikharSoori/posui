import axiosInstance from "../../../Utils/axios";

// API for notification
export const getAllNotifications = (postsPerPage) => axiosInstance.get(`/api/v1/notification/my-notification/?ordering=-id&limit=${postsPerPage}`);

export const getNotification = (id) => axiosInstance.get(`api/v1/message/all-notification/${id}/`);

export const updateNotification = (id, body) => axiosInstance.patch(`api/v1/notification/my-notification/${id}/`, body);

export const markAllNotificationRead = () => axiosInstance.post(`api/v1/notification/mark-all-messages-as-read/`);
