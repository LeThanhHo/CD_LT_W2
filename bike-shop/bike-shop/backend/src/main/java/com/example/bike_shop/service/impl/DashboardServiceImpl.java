package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.DashboardStatsDTO;
import com.example.bike_shop.entity.enums.RoleName;
import com.example.bike_shop.repository.OrderDetailRepository;
import com.example.bike_shop.repository.OrderRepository;
import com.example.bike_shop.repository.ProductRepository;
import com.example.bike_shop.repository.UserRepository;
import com.example.bike_shop.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public DashboardStatsDTO getStats() {
        long totalCustomers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == RoleName.CUSTOMER)
                .count();

        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        long newCustomersThisMonth = userRepository.findAll().stream()
                .filter(u -> u.getRole() == RoleName.CUSTOMER)
                .filter(u -> u.getCreatedAt() != null && !u.getCreatedAt().toLocalDate().isBefore(firstDayOfMonth))
                .count();

        List<DashboardStatsDTO.BestSellerDTO> bestSellers = orderDetailRepository
                .findBestSellers(PageRequest.of(0, 5))
                .stream()
                .map(p -> DashboardStatsDTO.BestSellerDTO.builder()
                        .productId(p.getProductId())
                        .productName(p.getProductName())
                        .productImage(p.getProductImage())
                        .totalSold(p.getTotalSold())
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalRevenue(orderRepository.getTotalRevenue())
                .totalOrders((long) orderRepository.findAll().size())
                .totalProducts((long) productRepository.findAll().size())
                .totalCustomers(totalCustomers)
                .newCustomersThisMonth(newCustomersThisMonth)
                .bestSellingProducts(bestSellers)
                .build();
    }
}
