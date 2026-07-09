package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.FavoriteDTO;
import com.example.bike_shop.entity.Favorite;
import com.example.bike_shop.entity.Product;
import com.example.bike_shop.entity.User;
import com.example.bike_shop.exception.BadRequestException;
import com.example.bike_shop.exception.ResourceNotFoundException;
import com.example.bike_shop.mapper.FavoriteMapper;
import com.example.bike_shop.repository.FavoriteRepository;
import com.example.bike_shop.repository.ProductRepository;
import com.example.bike_shop.repository.UserRepository;
import com.example.bike_shop.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final FavoriteMapper favoriteMapper;

    @Override
    public List<FavoriteDTO> getByUser(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(favoriteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FavoriteDTO add(Long userId, Long productId) {
        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BadRequestException("Sản phẩm đã có trong danh sách yêu thích");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng id=" + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm id=" + productId));

        Favorite favorite = Favorite.builder().user(user).product(product).build();
        return favoriteMapper.toDTO(favoriteRepository.save(favorite));
    }

    @Override
    public void remove(Long userId, Long productId) {
        if (!favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ResourceNotFoundException("Sản phẩm chưa có trong danh sách yêu thích");
        }
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Override
    public boolean isFavorite(Long userId, Long productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }
}
