package com.example.bike_shop.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

public class CartDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CartItemDTO {
        private Long id;
        private Long productId;
        private String productName;
        private String productImage;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal subTotal;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CartResponse {
        private Long id;
        private List<CartItemDTO> items;
        private BigDecimal totalPrice;
        private Integer totalItems;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddToCartRequest {
        @NotNull(message = "productId không được để trống")
        private Long productId;

        @NotNull(message = "quantity không được để trống")
        @Positive(message = "quantity phải lớn hơn 0")
        private Integer quantity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateCartItemRequest {
        @NotNull(message = "quantity không được để trống")
        @Positive(message = "quantity phải lớn hơn 0")
        private Integer quantity;
    }
}
