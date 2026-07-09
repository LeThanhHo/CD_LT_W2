package com.example.bike_shop.repository;

import com.example.bike_shop.entity.Product;
import com.example.bike_shop.entity.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    long countByStatus(ProductStatus status);
}
