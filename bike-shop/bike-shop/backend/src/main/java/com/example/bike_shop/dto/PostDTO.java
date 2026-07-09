package com.example.bike_shop.dto;

import com.example.bike_shop.entity.enums.PostStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {
    private Long id;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String slug;

    private String thumbnail;

    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    private String author;

    private PostStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // A short preview used in listing pages, derived from content on the backend
    private String excerpt;
}
