import axiosClient from "./axiosConfig";

const orderService = {
  create: (data) => axiosClient.post("/orders", data),
  getMyOrders: () => axiosClient.get("/orders/my-orders"),
  getAll: () => axiosClient.get("/orders"),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  updateStatus: (id, data) => axiosClient.put(`/orders/${id}/status`, data),
  cancel: (id) => axiosClient.put(`/orders/${id}/cancel`),
};

export default orderService;
