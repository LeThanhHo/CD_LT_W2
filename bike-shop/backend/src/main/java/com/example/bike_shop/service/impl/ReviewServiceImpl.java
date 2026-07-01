package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.ReviewDTO;
import com.example.bike_shop.entity.Product;
import com.example.bike_shop.entity.Review;
import com.example.bike_shop.entity.User;
import com.example.bike_shop.exception.BadRequestException;
import com.example.bike_shop.exception.ResourceNotFoundException;
import com.example.bike_shop.mapper.ReviewMapper;
import com.example.bike_shop.repository.OrderRepository;
import com.example.bike_shop.repository.ProductRepository;
import com.example.bike_shop.repository.ReviewRepository;
import com.example.bike_shop.repository.UserRepository;
import com.example.bike_shop.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public List<ReviewDTO> getByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(reviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDTO create(Long userId, Long productId, ReviewDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng id=" + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm id=" + productId));

        if (reviewRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BadRequestException("Bạn đã đánh giá sản phẩm này rồi");
        }

        if (!orderRepository.existsCompletedOrderByUserAndProduct(userId, productId)) {
            throw new BadRequestException(
                    "Bạn cần mua và nhận sản phẩm này thành công trước khi có thể đánh giá");
        }

        Review review = reviewMapper.toEntity(dto, user, product);
        return reviewMapper.toDTO(reviewRepository.save(review));
    }

    @Override
    public void delete(Long userId, Long reviewId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá id=" + reviewId));

        if (!isAdmin && !review.getUser().getId().equals(userId)) {
            throw new BadRequestException("Bạn không có quyền xoá đánh giá này");
        }

        reviewRepository.delete(review);
    }

    @Override
    public boolean canReview(Long userId, Long productId) {
        boolean alreadyReviewed = reviewRepository.existsByUserIdAndProductId(userId, productId);
        boolean purchased = orderRepository.existsCompletedOrderByUserAndProduct(userId, productId);
        return purchased && !alreadyReviewed;
    }
}