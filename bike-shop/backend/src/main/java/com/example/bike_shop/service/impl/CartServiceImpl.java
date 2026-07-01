package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.CartDTO;
import com.example.bike_shop.entity.Cart;
import com.example.bike_shop.entity.CartItem;
import com.example.bike_shop.entity.Product;
import com.example.bike_shop.entity.User;
import com.example.bike_shop.exception.BadRequestException;
import com.example.bike_shop.exception.ResourceNotFoundException;
import com.example.bike_shop.mapper.CartMapper;
import com.example.bike_shop.repository.CartItemRepository;
import com.example.bike_shop.repository.CartRepository;
import com.example.bike_shop.repository.ProductRepository;
import com.example.bike_shop.repository.UserRepository;
import com.example.bike_shop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng id=" + userId));
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }

    @Override
    public CartDTO.CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return cartMapper.toCartResponse(cart);
    }

    @Override
    public CartDTO.CartResponse addToCart(Long userId, CartDTO.AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm id=" + request.getProductId()));

        if (product.getQuantity() != null && product.getQuantity() < request.getQuantity()) {
            throw new BadRequestException("Số lượng tồn kho không đủ");
        }

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (item != null) {
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
        }
        cartItemRepository.save(item);

        return cartMapper.toCartResponse(cartRepository.findByUserId(userId).orElseThrow());
    }

    @Override
    public CartDTO.CartResponse updateCartItem(Long userId, Long itemId, CartDTO.UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng id=" + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return cartMapper.toCartResponse(cartRepository.findByUserId(userId).orElseThrow());
    }

    @Override
    public CartDTO.CartResponse removeCartItem(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng id=" + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        cartItemRepository.delete(item);
        return cartMapper.toCartResponse(cartRepository.findByUserId(userId).orElseThrow());
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
