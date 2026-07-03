package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.PostDTO;
import com.example.bike_shop.entity.Post;
import com.example.bike_shop.entity.enums.PostStatus;

public class PostMapper {

    public static PostDTO toDTO(Post post) {
        if (post == null) return null;
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setSlug(post.getSlug());
        dto.setSummary(post.getSummary());
        dto.setContent(post.getContent());
        dto.setThumbnail(post.getThumbnail());
        dto.setStatus(post.getStatus().name());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        if (post.getAuthor() != null) {
            dto.setAuthorId(post.getAuthor().getId());
            dto.setAuthorName(post.getAuthor().getFullname());
        }
        return dto;
    }

    public static Post toEntity(PostDTO dto) {
        if (dto == null) return null;
        return Post.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .slug(dto.getSlug())
                .summary(dto.getSummary())
                .content(dto.getContent())
                .thumbnail(dto.getThumbnail())
                .status(PostStatus.valueOf(dto.getStatus()))
                .build();
    }
}