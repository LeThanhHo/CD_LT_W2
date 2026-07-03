package com.example.bike_shop.controller;

import com.example.bike_shop.dto.PostDTO;
import com.example.bike_shop.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    // --- ENDPOINTS CÔNG KHAI (FRONTEND) ---
    @GetMapping
    public ResponseEntity<List<PostDTO>> getPublicPosts() {
        return ResponseEntity.ok(postService.getPublicPosts());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<PostDTO> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(postService.getPostBySlug(slug));
    }

    // --- ENDPOINTS QUẢN TRỊ (BACKEND ADMIN/STAFF) ---
    @GetMapping("/admin/all")
    public ResponseEntity<List<PostDTO>> getAllForAdmin() {
        return ResponseEntity.ok(postService.getAllPostsForAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PostMapping
    public ResponseEntity<PostDTO> create(@RequestBody PostDTO dto, Authentication auth) {
        return ResponseEntity.ok(postService.createPost(dto, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> update(@PathVariable Long id, @RequestBody PostDTO dto) {
        return ResponseEntity.ok(postService.updatePost(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}