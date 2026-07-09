import axiosClient from "./axiosConfig";

const favoriteService = {
  getAll: () => axiosClient.get("/favorite"),
  isFavorite: (productId) => axiosClient.get(`/favorite/${productId}`),
  add: (productId) => axiosClient.post(`/favorite/${productId}`),
  remove: (productId) => axiosClient.delete(`/favorite/${productId}`),
};

export default favoriteService;
