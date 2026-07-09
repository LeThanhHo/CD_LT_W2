package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.OrderDTO;
import com.example.bike_shop.entity.Order;
import com.example.bike_shop.entity.OrderDetail;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDTO.OrderDetailDTO toDetailDTO(OrderDetail detail) {
        return OrderDTO.OrderDetailDTO.builder()
                .id(detail.getId())
                .productId(detail.getProduct().getId())
                .productName(detail.getProduct().getName())
                .productImage(detail.getProduct().getImage())
                .quantity(detail.getQuantity())
                .price(detail.getPrice())
                .build();
    }

    public OrderDTO.OrderResponse toResponse(Order order) {
        List<OrderDTO.OrderDetailDTO> details = order.getOrderDetails().stream()
                .map(this::toDetailDTO)
                .collect(Collectors.toList());

        return OrderDTO.OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userFullname(order.getUser().getFullname())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .orderDate(order.getOrderDate())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingAddress(order.getShippingAddress())
                .note(order.getNote())
                .orderDetails(details)
                .build();
    }
}
