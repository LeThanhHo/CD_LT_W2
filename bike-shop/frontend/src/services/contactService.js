import axiosClient from "./axiosConfig";

const contactService = {
  submit: (data) => axiosClient.post("/contact", data),
  getAll: () => axiosClient.get("/contact"),
  markProcessed: (id) => axiosClient.put(`/contact/${id}`),
  delete: (id) => axiosClient.delete(`/contact/${id}`),
};

export default contactService;
