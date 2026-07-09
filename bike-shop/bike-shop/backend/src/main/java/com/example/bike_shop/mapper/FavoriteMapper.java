package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.FavoriteDTO;
import com.example.bike_shop.entity.Favorite;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FavoriteMapper {

    private final ProductMapper productMapper;

    public FavoriteDTO toDTO(Favorite favorite) {
        if (favorite == null) return null;
        return FavoriteDTO.builder()
                .id(favorite.getId())
                .product(productMapper.toDTO(favorite.getProduct()))
                .createdAt(favorite.getCreatedAt())
                .build();
    }
}
