package com.example.bike_shop.service.impl;

import com.example.bike_shop.exception.BadRequestException;
import com.example.bike_shop.service.FileStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif");
    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024; // 10MB

    private Path uploadPath;

    @PostConstruct
    public void init() {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Không thể khởi tạo thư mục lưu ảnh: " + uploadDir, e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn một tệp ảnh để tải lên");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Kích thước ảnh không được vượt quá 10MB");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException(
                    "Định dạng ảnh không hợp lệ. Chỉ chấp nhận: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        String newFilename = UUID.randomUUID() + "." + extension;

        try {
            Path targetPath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu tệp ảnh: " + newFilename, e);
        }

        return "/uploads/" + newFilename;
    }

    @Override
    public void delete(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) {
            return;
        }
        try {
            String filename = fileUrl.substring("/uploads/".length());
            Path targetPath = uploadPath.resolve(filename).normalize();
            if (targetPath.startsWith(uploadPath)) {
                Files.deleteIfExists(targetPath);
            }
        } catch (IOException ignored) {
            // best-effort cleanup; don't block the main operation if deletion fails
        }
    }
}