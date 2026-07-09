import axiosClient from "./axiosConfig";

const dashboardService = {
  getStats: () => axiosClient.get("/admin/dashboard/stats"),
};

export default dashboardService;
