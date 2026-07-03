package com.example.bike_shop.entity;
import com.example.bike_shop.entity.enums.PostStatus;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 255)
    private String slug; // Đường dẫn thân thiện dạng: xe-dap-the-thao-tot-nhat

    @Column(columnDefinition = "TEXT")
    private String summary; // Tóm tắt ngắn hiển thị ngoài danh sách

    @Column(columnDefinition = "LONGTEXT")
    private String content; // Nội dung chi tiết (hỗ trợ HTML/Markdown)

    private String thumbnail; // Ảnh đại diện bài viết

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author; // Người viết (ADMIN hoặc STAFF)

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}