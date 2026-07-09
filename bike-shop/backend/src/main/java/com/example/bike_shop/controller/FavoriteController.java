package com.example.bike_shop.controller;

import com.example.bike_shop.dto.FavoriteDTO;
import com.example.bike_shop.security.UserPrincipal;
import com.example.bike_shop.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorite")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<FavoriteDTO>> getMyFavorites(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(favoriteService.getByUser(principal.getId()));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Boolean> isFavorite(@AuthenticationPrincipal UserPrincipal principal,
                                               @PathVariable Long productId) {
        return ResponseEntity.ok(favoriteService.isFavorite(principal.getId(), productId));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<FavoriteDTO> add(@AuthenticationPrincipal UserPrincipal principal,
                                            @PathVariable Long productId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(favoriteService.add(principal.getId(), productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> remove(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long productId) {
        favoriteService.remove(principal.getId(), productId);
        return ResponseEntity.noContent().build();
    }
}
