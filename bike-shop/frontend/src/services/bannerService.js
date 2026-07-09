import axiosClient from "./axiosConfig";


const bannerService = {
  // Lấy banner hiển thị ngoài trang chủ
  getActive: () => axiosClient.get(`banners/active`),
  
  // Các hàm quản lý cho Admin
  getAllAdmin: () => axiosClient.get(`banners/admin/all`),
  create: (data) => axiosClient.post(`banners`, data),
  update: (id, data) => axiosClient.put(`banners/${id}`, data),
  toggleVisibility: (id) => axiosClient.put(`banners/${id}/toggle`),
  delete: (id) => axiosClient.delete(`banners/${id}`),
};

export default bannerService;