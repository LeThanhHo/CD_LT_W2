package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.PostDTO;
import com.example.bike_shop.entity.Post;
import com.example.bike_shop.entity.enums.PostStatus;
import com.example.bike_shop.entity.User;
import com.example.bike_shop.mapper.PostMapper;
import com.example.bike_shop.repository.PostRepository;
import com.example.bike_shop.repository.UserRepository;
import com.example.bike_shop.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public List<PostDTO> getPublicPosts() {
        return postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED)
                .stream().map(PostMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<PostDTO> getAllPostsForAdmin() {
        return postRepository.findAll().stream().map(PostMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public PostDTO getPostById(Long id) {
        return postRepository.findById(id).map(PostMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết!"));
    }

    @Override
    public PostDTO getPostBySlug(String slug) {
        return postRepository.findBySlug(slug).map(PostMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết!"));
    }

    @Override
    @Transactional
    public PostDTO createPost(PostDTO dto, String username) {
        User author = userRepository.findByUsername(username).orElseThrow();
        Post post = PostMapper.toEntity(dto);
        post.setAuthor(author);
        
        // Tạo slug tự động đơn giản nếu không truyền lên
        if (post.getSlug() == null || post.getSlug().isBlank()) {
            post.setSlug(dto.getTitle().toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-"));
        }
        
        return PostMapper.toDTO(postRepository.save(post));
    }

    @Override
    @Transactional
    public PostDTO updatePost(Long id, PostDTO dto) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setTitle(dto.getTitle());
        post.setSlug(dto.getSlug());
        post.setSummary(dto.getSummary());
        post.setContent(dto.getContent());
        post.setThumbnail(dto.getThumbnail());
        post.setStatus(PostStatus.valueOf(dto.getStatus()));
        return PostMapper.toDTO(postRepository.save(post));
    }

    @Override
    @Transactional
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}   