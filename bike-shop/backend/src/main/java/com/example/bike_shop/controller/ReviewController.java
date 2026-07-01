package com.example.bike_shop.controller;

import com.example.bike_shop.dto.ReviewDTO;
import com.example.bike_shop.entity.enums.RoleName;
import com.example.bike_shop.security.UserPrincipal;
import com.example.bike_shop.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getByProduct(productId));
    }

    @GetMapping("/product/{productId}/can-review")
    public ResponseEntity<Boolean> canReview(@AuthenticationPrincipal UserPrincipal principal,
                                              @PathVariable Long productId) {
        if (principal == null) {
            return ResponseEntity.ok(false);
        }
        return ResponseEntity.ok(reviewService.canReview(principal.getId(), productId));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ReviewDTO> create(@AuthenticationPrincipal UserPrincipal principal,
                                             @PathVariable Long productId,
                                             @Valid @RequestBody ReviewDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.create(principal.getId(), productId, dto));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long reviewId) {
        boolean isAdmin = principal.getUser().getRole() == RoleName.ADMIN;
        reviewService.delete(principal.getId(), reviewId, isAdmin);
        return ResponseEntity.noContent().build();
    }
}