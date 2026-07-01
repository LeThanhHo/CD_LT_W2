package com.example.bike_shop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandDTO {
    private Long id;

    @NotBlank(message = "Tên hãng không được để trống")
    private String name;

    private String logo;
}
