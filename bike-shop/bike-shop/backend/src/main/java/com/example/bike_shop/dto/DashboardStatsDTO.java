package com.example.bike_shop.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalProducts;
    private Long totalCustomers;
    private Long newCustomersThisMonth;
    private List<BestSellerDTO> bestSellingProducts;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BestSellerDTO {
        private Long productId;
        private String productName;
        private String productImage;
        private Long totalSold;
    }
}
