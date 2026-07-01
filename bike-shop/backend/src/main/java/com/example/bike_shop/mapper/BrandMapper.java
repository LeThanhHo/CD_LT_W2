package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.BrandDTO;
import com.example.bike_shop.entity.Brand;
import org.springframework.stereotype.Component;

@Component
public class BrandMapper {

    public BrandDTO toDTO(Brand brand) {
        if (brand == null) return null;
        return BrandDTO.builder()
                .id(brand.getId())
                .name(brand.getName())
                .logo(brand.getLogo())
                .build();
    }

    public Brand toEntity(BrandDTO dto) {
        if (dto == null) return null;
        return Brand.builder()
                .id(dto.getId())
                .name(dto.getName())
                .logo(dto.getLogo())
                .build();
    }

    public void updateEntityFromDTO(BrandDTO dto, Brand brand) {
        brand.setName(dto.getName());
        brand.setLogo(dto.getLogo());
    }
}
