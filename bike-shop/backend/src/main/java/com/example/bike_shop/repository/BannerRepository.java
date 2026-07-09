package com.example.bike_shop.repository;

import com.example.bike_shop.entity.Banner;
import com.example.bike_shop.entity.enums.BannerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    
    // Lấy danh sách banner hiển thị ra Trang chủ (sắp xếp theo thuộc tính position)
    @Query("SELECT b FROM Banner b WHERE b.status = 'PUBLISHED' ORDER BY b.position ASC")
    List<Banner> getActiveBanners();
}