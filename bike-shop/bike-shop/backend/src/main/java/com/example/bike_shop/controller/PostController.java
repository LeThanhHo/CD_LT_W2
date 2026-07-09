package com.example.bike_shop.controller;

import com.example.bike_shop.dto.PostDTO;
import com.example.bike_shop.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /** Public: only published posts, newest first. */
    @GetMapping
    public ResponseEntity<List<PostDTO>> getPublished() {
        return ResponseEntity.ok(postService.getPublished());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<PostDTO> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(postService.getBySlug(slug));
    }

    /** ADMIN: full list including hidden posts. */
    @GetMapping("/admin/all")
    public ResponseEntity<List<PostDTO>> getAll() {
        return ResponseEntity.ok(postService.getAll());
    }

    @PostMapping
    public ResponseEntity<PostDTO> create(@Valid @RequestBody PostDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> update(@PathVariable Long id, @Valid @RequestBody PostDTO dto) {
        return ResponseEntity.ok(postService.update(id, dto));
    }

    @PatchMapping("/{id}/toggle-visibility")
    public ResponseEntity<PostDTO> toggleVisibility(@PathVariable Long id) {
        return ResponseEntity.ok(postService.toggleVisibility(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
