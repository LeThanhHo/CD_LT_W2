package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.PostDTO;
import com.example.bike_shop.entity.Post;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    private static final int EXCERPT_LENGTH = 160;

    public PostDTO toDTO(Post post) {
        if (post == null) return null;
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .thumbnail(post.getThumbnail())
                .content(post.getContent())
                .author(post.getAuthor())
                .status(post.getStatus())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .excerpt(buildExcerpt(post.getContent()))
                .build();
    }

    private String buildExcerpt(String content) {
        if (content == null) return "";
        String plain = content.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
        return plain.length() > EXCERPT_LENGTH ? plain.substring(0, EXCERPT_LENGTH) + "..." : plain;
    }

    public Post toEntity(PostDTO dto) {
        if (dto == null) return null;
        return Post.builder()
                .title(dto.getTitle())
                .slug(dto.getSlug())
                .thumbnail(dto.getThumbnail())
                .content(dto.getContent())
                .author(dto.getAuthor())
                .status(dto.getStatus() != null ? dto.getStatus() : com.example.bike_shop.entity.enums.PostStatus.PUBLISHED)
                .build();
    }

    public void updateEntityFromDTO(PostDTO dto, Post post) {
        post.setTitle(dto.getTitle());
        post.setThumbnail(dto.getThumbnail());
        post.setContent(dto.getContent());
        post.setAuthor(dto.getAuthor());
        if (dto.getStatus() != null) {
            post.setStatus(dto.getStatus());
        }
    }
}
