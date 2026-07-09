package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.CartDTO;
import com.example.bike_shop.entity.Cart;
import com.example.bike_shop.entity.CartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartDTO.CartItemDTO toItemDTO(CartItem item) {
        BigDecimal subTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartDTO.CartItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImage())
                .price(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .subTotal(subTotal)
                .build();
    }

    public CartDTO.CartResponse toCartResponse(Cart cart) {
        List<CartDTO.CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());

        BigDecimal total = itemDTOs.stream()
                .map(CartDTO.CartItemDTO::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = itemDTOs.stream().mapToInt(CartDTO.CartItemDTO::getQuantity).sum();

        return CartDTO.CartResponse.builder()
                .id(cart.getId())
                .items(itemDTOs)
                .totalPrice(total)
                .totalItems(totalItems)
                .build();
    }
}
