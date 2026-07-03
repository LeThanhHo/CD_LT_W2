package com.example.bike_shop.service;

import com.example.bike_shop.dto.PostDTO;
import java.util.List;

public interface PostService {
    List<PostDTO> getPublicPosts();
    List<PostDTO> getAllPostsForAdmin();
    PostDTO getPostById(Long id);
    PostDTO getPostBySlug(String slug);
    PostDTO createPost(PostDTO dto, String username);
    PostDTO updatePost(Long id, PostDTO dto);
    void deletePost(Long id);
}