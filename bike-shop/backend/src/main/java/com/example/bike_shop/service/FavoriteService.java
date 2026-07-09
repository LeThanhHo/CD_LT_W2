package com.example.bike_shop.service;

import com.example.bike_shop.dto.FavoriteDTO;

import java.util.List;

public interface FavoriteService {
    List<FavoriteDTO> getByUser(Long userId);
    FavoriteDTO add(Long userId, Long productId);
    void remove(Long userId, Long productId);
    boolean isFavorite(Long userId, Long productId);
}
