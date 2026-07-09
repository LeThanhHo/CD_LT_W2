package com.example.bike_shop.service.impl;

import com.example.bike_shop.entity.Banner;
import com.example.bike_shop.entity.enums.BannerStatus;
import com.example.bike_shop.repository.BannerRepository;
import com.example.bike_shop.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerRepository bannerRepository;

    @Override
    public List<Banner> getActiveBanners() {
        return bannerRepository.getActiveBanners();
    }

    @Override
    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    @Override
    public Banner createBanner(Banner banner) {
        return bannerRepository.save(banner);
    }

    @Override
    public Banner updateBanner(Long id, Banner bannerDetails) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Banner id: " + id));
        
        banner.setTitle(bannerDetails.getTitle());
        banner.setImage(bannerDetails.getImage());
        banner.setLink(bannerDetails.getLink());
        banner.setPosition(bannerDetails.getPosition());
        banner.setStatus(bannerDetails.getStatus());
        
        return bannerRepository.save(banner);
    }

    @Override
    public Banner toggleVisibility(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Banner id: " + id));
        
        banner.setStatus(banner.getStatus() == BannerStatus.PUBLISHED ? BannerStatus.HIDDEN : BannerStatus.PUBLISHED);
        return bannerRepository.save(banner);
    }

    @Override
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Banner id: " + id));
        bannerRepository.delete(banner);
    }
}