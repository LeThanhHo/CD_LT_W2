package com.example.bike_shop.service;

import com.example.bike_shop.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    List<ReviewDTO> getByProduct(Long productId, Long currentUserId);
    ReviewDTO create(Long userId, Long productId, ReviewDTO dto);
    void delete(Long userId, Long reviewId, boolean isAdmin);
    boolean canReview(Long userId, Long productId);
    ReviewDTO reply(Long reviewId, String reply);
    ReviewDTO toggleLike(Long userId, Long reviewId);
    List<ReviewDTO> getTestimonials();
    List<ReviewDTO> getAllForAdmin();
}
