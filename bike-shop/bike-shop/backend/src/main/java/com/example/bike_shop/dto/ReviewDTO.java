package com.example.bike_shop.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Long id;
    private Long userId;
    private String userFullname;
    private Long productId;
    private String productName;
    private String productImage;

    @NotNull(message = "Rating không được để trống")
    @Min(value = 1, message = "Rating tối thiểu là 1")
    @Max(value = 5, message = "Rating tối đa là 5")
    private Integer rating;

    private String comment;
    private List<String> images;

    private String reply;
    private LocalDateTime repliedAt;

    private Integer likeCount;
    private boolean likedByMe;

    private LocalDateTime createdAt;
}
