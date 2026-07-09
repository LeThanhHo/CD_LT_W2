package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.ProductDTO;
import com.example.bike_shop.entity.Brand;
import com.example.bike_shop.entity.Category;
import com.example.bike_shop.entity.Product;
import com.example.bike_shop.entity.ProductImage;
import com.example.bike_shop.entity.Review;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product) {
        if (product == null) return null;

        Double avgRating = 0.0;
        int reviewCount = 0;
        if (product.getReviews() != null && !product.getReviews().isEmpty()) {
            reviewCount = product.getReviews().size();
            avgRating = product.getReviews().stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
        }

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .image(product.getImage())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .images(product.getImages() != null ?
                        product.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList())
                        : null)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .reviewCount(reviewCount)
                .build();
    }

    public Product toEntity(ProductDTO dto, Category category, Brand brand) {
        if (dto == null) return null;
        return Product.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .image(dto.getImage())
                .category(category)
                .brand(brand)
                .status(dto.getStatus() != null ? dto.getStatus() : com.example.bike_shop.entity.enums.ProductStatus.AVAILABLE)
                .build();
    }

    public void updateEntityFromDTO(ProductDTO dto, Product product, Category category, Brand brand) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setImage(dto.getImage());
        product.setCategory(category);
        product.setBrand(brand);
        if (dto.getStatus() != null) {
            product.setStatus(dto.getStatus());
        }
    }
}
