package com.example.bike_shop.service;

import com.example.bike_shop.dto.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO.OrderResponse createOrder(Long userId, OrderDTO.CreateOrderRequest request);
    List<OrderDTO.OrderResponse> getOrdersByUser(Long userId);
    List<OrderDTO.OrderResponse> getAllOrders();
    OrderDTO.OrderResponse getOrderById(Long id);
    OrderDTO.OrderResponse updateStatus(Long id, OrderDTO.UpdateOrderStatusRequest request);
    void cancelOrder(Long userId, Long id);
}
