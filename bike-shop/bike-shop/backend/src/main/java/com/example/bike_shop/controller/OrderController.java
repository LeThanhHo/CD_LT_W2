package com.example.bike_shop.controller;

import com.example.bike_shop.dto.OrderDTO;
import com.example.bike_shop.entity.enums.RoleName;
import com.example.bike_shop.security.UserPrincipal;
import com.example.bike_shop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO.OrderResponse> createOrder(@AuthenticationPrincipal UserPrincipal principal,
                                                                @Valid @RequestBody OrderDTO.CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(principal.getId(), request));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO.OrderResponse>> myOrders(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(orderService.getOrdersByUser(principal.getId()));
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO.OrderResponse>> allOrders(@AuthenticationPrincipal UserPrincipal principal) {
        // ADMIN/STAFF only - enforced also at SecurityConfig level for write ops;
        // here we allow ADMIN/STAFF to view all orders
        if (principal.getUser().getRole() == RoleName.CUSTOMER) {
            return ResponseEntity.ok(orderService.getOrdersByUser(principal.getId()));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO.OrderResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO.OrderResponse> updateStatus(@PathVariable Long id,
                                                                 @Valid @RequestBody OrderDTO.UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        orderService.cancelOrder(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
