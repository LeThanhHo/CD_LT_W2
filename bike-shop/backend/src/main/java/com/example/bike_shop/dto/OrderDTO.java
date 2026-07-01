package com.example.bike_shop.dto;

import com.example.bike_shop.entity.enums.OrderStatus;
import com.example.bike_shop.entity.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderDetailDTO {
        private Long id;
        private Long productId;
        private String productName;
        private String productImage;
        private Integer quantity;
        private BigDecimal price;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderResponse {
        private Long id;
        private Long userId;
        private String userFullname;
        private BigDecimal totalPrice;
        private OrderStatus status;
        private PaymentMethod paymentMethod;
        private LocalDateTime orderDate;
        private String receiverName;
        private String receiverPhone;
        private String shippingAddress;
        private String note;
        private List<OrderDetailDTO> orderDetails;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrderRequest {
        @NotNull(message = "Phương thức thanh toán không được để trống")
        private PaymentMethod paymentMethod;

        @NotBlank(message = "Tên người nhận không được để trống")
        private String receiverName;

        @NotBlank(message = "Số điện thoại không được để trống")
        private String receiverPhone;

        @NotBlank(message = "Địa chỉ giao hàng không được để trống")
        private String shippingAddress;

        private String note;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateOrderStatusRequest {
        @NotNull(message = "Trạng thái không được để trống")
        private OrderStatus status;
    }
}
