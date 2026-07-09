package com.example.bike_shop.service;

import com.example.bike_shop.entity.Banner;
import java.util.List;

public interface BannerService {
    List<Banner> getActiveBanners();
    List<Banner> getAllBanners();
    Banner createBanner(Banner banner);
    Banner updateBanner(Long id, Banner bannerDetails);
    Banner toggleVisibility(Long id);
    void deleteBanner(Long id);
}