package com.example.bike_shop.repository;

import com.example.bike_shop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.status = 'COMPLETED'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.orderDetails od " +
            "WHERE o.user.id = :userId AND od.product.id = :productId AND o.status = 'COMPLETED'")
    boolean existsCompletedOrderByUserAndProduct(@Param("userId") Long userId, @Param("productId") Long productId);
}
