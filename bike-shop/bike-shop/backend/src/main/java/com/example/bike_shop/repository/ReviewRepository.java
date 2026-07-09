package com.example.bike_shop.repository;

import com.example.bike_shop.entity.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<Review> findAllByOrderByCreatedAtDesc();
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    @Query("SELECT r FROM Review r WHERE r.rating >= 4 AND r.comment IS NOT NULL AND r.comment <> '' " +
            "ORDER BY r.likeCount DESC, r.createdAt DESC")
    List<Review> findTestimonials(Pageable pageable);
}
