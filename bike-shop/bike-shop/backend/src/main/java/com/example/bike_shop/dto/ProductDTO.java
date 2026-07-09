package com.example.bike_shop.dto;

import com.example.bike_shop.entity.enums.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String description;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    private Integer quantity;

    private String image;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;
    private String categoryName;

    @NotNull(message = "Hãng không được để trống")
    private Long brandId;
    private String brandName;

    private ProductStatus status;

    private LocalDateTime createdAt;

    private List<String> images;

    private Double averageRating;
    private Integer reviewCount;
}
