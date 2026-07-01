import axiosClient from "./axiosConfig";

const productService = {
  getAll: (params) => axiosClient.get("/products", { params }),
  getById: (id) => axiosClient.get(`/products/${id}`),
  getFeatured: () => axiosClient.get("/products/featured"),
  getNewest: () => axiosClient.get("/products/newest"),
  create: (data) => axiosClient.post("/products", data),
  update: (id, data) => axiosClient.put(`/products/${id}`, data),
  delete: (id) => axiosClient.delete(`/products/${id}`),
};

export default productService;
