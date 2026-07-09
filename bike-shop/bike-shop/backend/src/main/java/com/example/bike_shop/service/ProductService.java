package com.example.bike_shop.service;

import com.example.bike_shop.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductService {
    Page<ProductDTO> searchProducts(String keyword, Long categoryId, Long brandId,
                                     BigDecimal minPrice, BigDecimal maxPrice,
                                     String sortBy, Pageable pageable);
    ProductDTO getById(Long id);
    ProductDTO create(ProductDTO dto);
    ProductDTO update(Long id, ProductDTO dto);
    void delete(Long id);
    java.util.List<ProductDTO> getFeatured();
    java.util.List<ProductDTO> getNewest();
    java.util.List<ProductDTO> getBestSellers();
}
