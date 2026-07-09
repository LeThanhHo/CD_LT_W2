import axiosClient from "./axiosConfig";

const notificationService = {
  getAll: () => axiosClient.get("/notification"),
  getUnreadCount: () => axiosClient.get("/notification/unread-count"),
  markRead: (id) => axiosClient.put(`/notification/read/${id}`),
  markAllRead: () => axiosClient.put("/notification/read-all"),
};

export default notificationService;
