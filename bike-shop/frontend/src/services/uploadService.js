import axiosClient from "./axiosConfig";

const uploadService = {
  // Uploads an image file selected from the user's device and returns { url }
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default uploadService;