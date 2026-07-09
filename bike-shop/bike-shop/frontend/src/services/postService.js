import axiosClient from "./axiosConfig";

const postService = {
  getPublished: () => axiosClient.get("/posts"),
  getById: (id) => axiosClient.get(`/posts/${id}`),
  getBySlug: (slug) => axiosClient.get(`/posts/slug/${slug}`),
  getAllAdmin: () => axiosClient.get("/posts/admin/all"),
  create: (data) => axiosClient.post("/posts", data),
  update: (id, data) => axiosClient.put(`/posts/${id}`, data),
  toggleVisibility: (id) => axiosClient.patch(`/posts/${id}/toggle-visibility`),
  delete: (id) => axiosClient.delete(`/posts/${id}`),
};

export default postService;
