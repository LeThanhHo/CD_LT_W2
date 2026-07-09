package com.example.bike_shop.controller;

import com.example.bike_shop.dto.CartDTO;
import com.example.bike_shop.security.UserPrincipal;
import com.example.bike_shop.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO.CartResponse> getCart(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getId()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO.CartResponse> addToCart(@AuthenticationPrincipal UserPrincipal principal,
                                                            @Valid @RequestBody CartDTO.AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(principal.getId(), request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDTO.CartResponse> updateItem(@AuthenticationPrincipal UserPrincipal principal,
                                                             @PathVariable Long itemId,
                                                             @Valid @RequestBody CartDTO.UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateCartItem(principal.getId(), itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO.CartResponse> removeItem(@AuthenticationPrincipal UserPrincipal principal,
                                                             @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeCartItem(principal.getId(), itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserPrincipal principal) {
        cartService.clearCart(principal.getId());
        return ResponseEntity.noContent().build();
    }
}
