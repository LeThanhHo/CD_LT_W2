package com.example.bike_shop.service;

import com.example.bike_shop.dto.CartDTO;

public interface CartService {
    CartDTO.CartResponse getCart(Long userId);
    CartDTO.CartResponse addToCart(Long userId, CartDTO.AddToCartRequest request);
    CartDTO.CartResponse updateCartItem(Long userId, Long itemId, CartDTO.UpdateCartItemRequest request);
    CartDTO.CartResponse removeCartItem(Long userId, Long itemId);
    void clearCart(Long userId);
}
