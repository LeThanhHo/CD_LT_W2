import axiosClient from "./axiosConfig";

const categoryService = {
  getAll: () => axiosClient.get("/categories"),
  getById: (id) => axiosClient.get(`/categories/${id}`),
  create: (data) => axiosClient.post("/categories", data),
  update: (id, data) => axiosClient.put(`/categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/categories/${id}`),
};

export default categoryService;
