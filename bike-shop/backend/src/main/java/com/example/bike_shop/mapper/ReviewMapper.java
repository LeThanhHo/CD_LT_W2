package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.ReviewDTO;
import com.example.bike_shop.entity.Product;
import com.example.bike_shop.entity.Review;
import com.example.bike_shop.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewDTO toDTO(Review review) {
        if (review == null) return null;
        return ReviewDTO.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userFullname(review.getUser().getFullname())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

    public Review toEntity(ReviewDTO dto, User user, Product product) {
        return Review.builder()
                .rating(dto.getRating())
                .comment(dto.getComment())
                .user(user)
                .product(product)
                .build();
    }
}
