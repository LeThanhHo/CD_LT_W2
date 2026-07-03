import axiosClient from "./axiosConfig";

const postService = {
  getPublicPosts: () => axiosClient.get("/posts"),
  getPostBySlug: (slug) => axiosClient.get(`/posts/slug/${slug}`),
  getAllAdmin: () => axiosClient.get("/posts/admin/all"),
  getById: (id) => axiosClient.get(`/posts/${id}`),
  create: (data) => axiosClient.post("/posts", data),
  update: (id, data) => axiosClient.put(`/posts/${id}`, data),
  delete: (id) => axiosClient.delete(`/posts/${id}`),
};

export default postService;