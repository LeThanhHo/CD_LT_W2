package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.DashboardStatsDTO;
import com.example.bike_shop.entity.enums.RoleName;
import com.example.bike_shop.repository.OrderRepository;
import com.example.bike_shop.repository.ProductRepository;
import com.example.bike_shop.repository.UserRepository;
import com.example.bike_shop.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public DashboardStatsDTO getStats() {
        long totalCustomers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == RoleName.CUSTOMER)
                .count();

        return DashboardStatsDTO.builder()
                .totalRevenue(orderRepository.getTotalRevenue())
                .totalOrders((long) orderRepository.findAll().size())
                .totalProducts((long) productRepository.findAll().size())
                .totalCustomers(totalCustomers)
                .build();
    }
}
