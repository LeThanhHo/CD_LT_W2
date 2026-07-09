package com.example.bike_shop.controller;

import com.example.bike_shop.entity.Banner;
import com.example.bike_shop.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin("*")
public class BannerController {

    @Autowired
    private BannerService bannerService;

    // 1. API lấy banner đang hiển thị ra Trang chủ
    @GetMapping("/active")
    public ResponseEntity<List<Banner>> getActiveBanners() {
        return ResponseEntity.ok(bannerService.getActiveBanners());
    }

    // 2. API Admin lấy tất cả banner
    @GetMapping("/admin/all")
    public ResponseEntity<List<Banner>> getAllBanners() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    // 3. API Admin thêm banner mới
    @PostMapping
    public ResponseEntity<Banner> createBanner(@RequestBody Banner banner) {
        return ResponseEntity.ok(bannerService.createBanner(banner));
    }

    // 4. API Admin cập nhật thông tin banner
    @PutMapping("/{id}")
    public ResponseEntity<Banner> updateBanner(@PathVariable Long id, @RequestBody Banner bannerDetails) {
        return ResponseEntity.ok(bannerService.updateBanner(id, bannerDetails));
    }

    // 5. API Admin đổi nhanh trạng thái Ẩn/Hiện
    @PutMapping("/{id}/toggle")
    public ResponseEntity<Banner> toggleVisibility(@PathVariable Long id) {
        return ResponseEntity.ok(bannerService.toggleVisibility(id));
    }

    // 6. API Admin xóa banner
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.ok("Đã xóa banner thành công");
    }
}