import axiosClient from "./axiosConfig";

const authService = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),
  forgotPassword: (email) => axiosClient.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    axiosClient.post("/auth/reset-password", { token, newPassword }),
  changePassword: (oldPassword, newPassword) =>
    axiosClient.put("/users/change-password", { oldPassword, newPassword }),
};

export default authService;