import axiosClient from "./axiosConfig";

const cartService = {
  getCart: () => axiosClient.get("/cart"),
  addItem: (data) => axiosClient.post("/cart/items", data),
  updateItem: (itemId, data) => axiosClient.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => axiosClient.delete(`/cart/items/${itemId}`),
  clearCart: () => axiosClient.delete("/cart"),
};

export default cartService;
