package com.example.bike_shop.service;

import com.example.bike_shop.dto.PostDTO;

import java.util.List;

public interface PostService {
    List<PostDTO> getPublished();
    List<PostDTO> getAll();
    PostDTO getById(Long id);
    PostDTO getBySlug(String slug);
    PostDTO create(PostDTO dto);
    PostDTO update(Long id, PostDTO dto);
    PostDTO toggleVisibility(Long id);
    void delete(Long id);
}
