package com.example.bike_shop.repository;

import com.example.bike_shop.entity.OrderDetail;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    @Query("SELECT od.product.id AS productId, od.product.name AS productName, " +
            "od.product.image AS productImage, SUM(od.quantity) AS totalSold " +
            "FROM OrderDetail od " +
            "WHERE od.order.status = 'COMPLETED' " +
            "GROUP BY od.product.id, od.product.name, od.product.image " +
            "ORDER BY SUM(od.quantity) DESC")
    List<BestSellerProjection> findBestSellers(Pageable pageable);

    interface BestSellerProjection {
        Long getProductId();
        String getProductName();
        String getProductImage();
        Long getTotalSold();
    }
}
