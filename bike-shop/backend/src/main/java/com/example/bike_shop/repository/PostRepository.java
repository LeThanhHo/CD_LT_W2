package com.example.bike_shop.repository;

import com.example.bike_shop.entity.Post;
import com.example.bike_shop.entity.enums.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Tìm các bài viết công khai để hiển thị ra Frontend cho khách hàng
    List<Post> findByStatusOrderByCreatedAtDesc(PostStatus status);
    
    // Tìm bài viết chi tiết dựa trên slug
    Optional<Post> findBySlug(String slug);
    
    boolean existsBySlug(String slug);
}