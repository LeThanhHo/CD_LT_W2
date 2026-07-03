import axiosClient from "./axiosConfig";

const reviewService = {
  getByProduct: (productId) => axiosClient.get(`/reviews/product/${productId}`),
  canReview: (productId) => axiosClient.get(`/reviews/product/${productId}/can-review`),
  create: (productId, data) => axiosClient.post(`/reviews/product/${productId}`, data),
  delete: (reviewId) => axiosClient.delete(`/reviews/${reviewId}`),
};

export default reviewService;
