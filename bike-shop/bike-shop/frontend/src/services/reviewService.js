import axiosClient from "./axiosConfig";

const reviewService = {
  getByProduct: (productId) => axiosClient.get(`/reviews/product/${productId}`),
  canReview: (productId) => axiosClient.get(`/reviews/product/${productId}/can-review`),
  create: (productId, data) => axiosClient.post(`/reviews/product/${productId}`, data),
  delete: (reviewId) => axiosClient.delete(`/reviews/${reviewId}`),
  reply: (reviewId, reply) => axiosClient.put(`/reviews/${reviewId}/reply`, { reply }),
  toggleLike: (reviewId) => axiosClient.post(`/reviews/${reviewId}/like`),
  getTestimonials: () => axiosClient.get("/reviews/latest"),
  getAllForAdmin: () => axiosClient.get("/reviews/admin/all"),
};

export default reviewService;
