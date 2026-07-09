package com.example.bike_shop.entity;

import com.example.bike_shop.entity.enums.BannerStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 255)
    private String image; // Lưu đường dẫn URL của ảnh banner

    @Column(length = 255)
    private String link; // Đường dẫn khi click vào banner (ví dụ: /products, /sales)

    @Column(name = "position")
    private Integer position; // Thứ tự hiển thị (1, 2, 3...)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BannerStatus status = BannerStatus.PUBLISHED;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}