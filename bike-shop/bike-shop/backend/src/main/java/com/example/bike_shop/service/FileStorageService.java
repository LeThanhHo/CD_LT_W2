package com.example.bike_shop.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Saves the uploaded file to disk and returns a public URL (e.g. "/uploads/xxxx.jpg")
     * that can be used directly as an <img src>.
     */
    String store(MultipartFile file);

    void delete(String fileUrl);
}
