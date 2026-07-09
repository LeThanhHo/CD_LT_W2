import axiosClient from "./axiosConfig";

const userService = {
  getMe: () => axiosClient.get("/users/me"),
  updateMe: (data) => axiosClient.put("/users/me", data),
  getAll: () => axiosClient.get("/users"),
  getById: (id) => axiosClient.get(`/users/${id}`),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default userService;
