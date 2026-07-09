package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.PostDTO;
import com.example.bike_shop.entity.Post;
import com.example.bike_shop.entity.enums.PostStatus;
import com.example.bike_shop.exception.ResourceNotFoundException;
import com.example.bike_shop.mapper.PostMapper;
import com.example.bike_shop.repository.PostRepository;
import com.example.bike_shop.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;

    @Override
    public List<PostDTO> getPublished() {
        return postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED).stream()
                .map(postMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostDTO> getAll() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(postMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PostDTO getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết id=" + id));
        return postMapper.toDTO(post);
    }

    @Override
    public PostDTO getBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết: " + slug));
        return postMapper.toDTO(post);
    }

    @Override
    public PostDTO create(PostDTO dto) {
        Post post = postMapper.toEntity(dto);
        post.setSlug(generateUniqueSlug(dto.getTitle()));
        return postMapper.toDTO(postRepository.save(post));
    }

    @Override
    public PostDTO update(Long id, PostDTO dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết id=" + id));

        if (!post.getTitle().equals(dto.getTitle())) {
            post.setSlug(generateUniqueSlug(dto.getTitle()));
        }
        postMapper.updateEntityFromDTO(dto, post);
        return postMapper.toDTO(postRepository.save(post));
    }

    @Override
    public PostDTO toggleVisibility(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết id=" + id));
        post.setStatus(post.getStatus() == PostStatus.PUBLISHED ? PostStatus.HIDDEN : PostStatus.PUBLISHED);
        return postMapper.toDTO(postRepository.save(post));
    }

    @Override
    public void delete(Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy bài viết id=" + id);
        }
        postRepository.deleteById(id);
    }

    private String generateUniqueSlug(String title) {
        String base = toSlug(title);
        String slug = base;
        int counter = 1;
        while (postRepository.existsBySlug(slug)) {
            slug = base + "-" + counter++;
        }
        return slug;
    }

    private String toSlug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String noAccents = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(normalized).replaceAll("");
        noAccents = noAccents.replace('đ', 'd').replace('Đ', 'D');
        String slug = noAccents.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
        return slug.isEmpty() ? "bai-viet" : slug;
    }
}
