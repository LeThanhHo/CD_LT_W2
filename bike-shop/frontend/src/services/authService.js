import axiosClient from "./axiosConfig";

const authService = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),
};

export default authService;
