import axiosClient from "./axiosConfig";

const chatService = {
  sendMessage: (message) => axiosClient.post("/chat", { message }),
};

export default chatService;
