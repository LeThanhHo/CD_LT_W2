package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.ReviewDTO;
import com.example.bike_shop.entity.Product;
import com.example.bike_shop.entity.Review;
import com.example.bike_shop.entity.ReviewImage;
import com.example.bike_shop.entity.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ReviewMapper {

    public ReviewDTO toDTO(Review review) {
        return toDTO(review, false);
    }

    public ReviewDTO toDTO(Review review, boolean likedByMe) {
        if (review == null) return null;
        return ReviewDTO.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userFullname(review.getUser().getFullname())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .productImage(review.getProduct().getImage())
                .rating(review.getRating())
                .comment(review.getComment())
                .images(review.getImages() != null
                        ? review.getImages().stream().map(ReviewImage::getImageUrl).collect(Collectors.toList())
                        : null)
                .reply(review.getReply())
                .repliedAt(review.getRepliedAt())
                .likeCount(review.getLikeCount())
                .likedByMe(likedByMe)
                .createdAt(review.getCreatedAt())
                .build();
    }

    public Review toEntity(ReviewDTO dto, User user, Product product) {
        return Review.builder()
                .rating(dto.getRating())
                .comment(dto.getComment())
                .user(user)
                .product(product)
                .likeCount(0)
                .build();
    }
}
