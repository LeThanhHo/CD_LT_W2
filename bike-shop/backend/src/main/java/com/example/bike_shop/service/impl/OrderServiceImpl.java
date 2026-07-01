package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.OrderDTO;
import com.example.bike_shop.entity.*;
import com.example.bike_shop.entity.enums.OrderStatus;
import com.example.bike_shop.entity.enums.PaymentStatus;
import com.example.bike_shop.exception.BadRequestException;
import com.example.bike_shop.exception.ResourceNotFoundException;
import com.example.bike_shop.mapper.OrderMapper;
import com.example.bike_shop.repository.*;
import com.example.bike_shop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderDTO.OrderResponse createOrder(Long userId, OrderDTO.CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng id=" + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Giỏ hàng trống"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Giỏ hàng trống, không thể đặt hàng");
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .shippingAddress(request.getShippingAddress())
                .note(request.getNote())
                .build();

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getQuantity() != null && product.getQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Sản phẩm '" + product.getName() + "' không đủ số lượng tồn kho");
            }

            OrderDetail detail = OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build();
            order.getOrderDetails().add(detail);

            totalPrice = totalPrice.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            if (product.getQuantity() != null) {
                product.setQuantity(product.getQuantity() - cartItem.getQuantity());
                productRepository.save(product);
            }
        }

        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);

        Payment payment = Payment.builder()
                .order(savedOrder)
                .paymentStatus(PaymentStatus.PENDING)
                .build();
        paymentRepository.save(payment);

        cart.getItems().clear();
        cartRepository.save(cart);

        return orderMapper.toResponse(savedOrder);
    }

    @Override
    public List<OrderDTO.OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO.OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO.OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng id=" + id));
        return orderMapper.toResponse(order);
    }

    @Override
    public OrderDTO.OrderResponse updateStatus(Long id, OrderDTO.UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng id=" + id));

        order.setStatus(request.getStatus());
        Order saved = orderRepository.save(order);

        if (request.getStatus() == OrderStatus.COMPLETED && order.getPayment() != null) {
            Payment payment = order.getPayment();
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setPaymentDate(java.time.LocalDateTime.now());
            paymentRepository.save(payment);
        }

        return orderMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void cancelOrder(Long userId, Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng id=" + id));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Bạn không có quyền huỷ đơn hàng này");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể huỷ đơn hàng ở trạng thái PENDING");
        }

        for (OrderDetail detail : order.getOrderDetails()) {
            Product product = detail.getProduct();
            if (product.getQuantity() != null) {
                product.setQuantity(product.getQuantity() + detail.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}
