package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.AuthDTO;
import com.example.bike_shop.entity.PasswordResetToken;
import com.example.bike_shop.entity.User;
import com.example.bike_shop.entity.enums.RoleName;
import com.example.bike_shop.exception.BadRequestException;
import com.example.bike_shop.mapper.UserMapper;
import com.example.bike_shop.repository.PasswordResetTokenRepository;
import com.example.bike_shop.repository.UserRepository;
import com.example.bike_shop.security.JwtService;
import com.example.bike_shop.security.UserPrincipal;
import com.example.bike_shop.service.AuthService;
import com.example.bike_shop.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.reset-token-expiry-minutes}")
    private long resetTokenExpiryMinutes;

    @Override
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullname(request.getFullname())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(RoleName.CUSTOMER)
                .enabled(true)
                .build();

        User saved = userRepository.save(user);
        UserPrincipal principal = new UserPrincipal(saved);
        String token = jwtService.generateToken(principal);

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(userMapper.toDTO(saved))
                .build();
    }

    @Override
    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Sai tên đăng nhập hoặc mật khẩu"));

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal);

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(userMapper.toDTO(user))
                .build();
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        // Luôn trả về thành công ở tầng controller dù email có tồn tại hay không,
        // để tránh lộ thông tin email nào đã đăng ký (user enumeration).
        userRepository.findByEmail(email).ifPresent(user -> {
            passwordResetTokenRepository.deleteByUserId(user.getId());

            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiryDate(LocalDateTime.now().plusMinutes(resetTokenExpiryMinutes))
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFullname(), resetLink);
        });
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Liên kết đặt lại mật khẩu không hợp lệ"));

        if (resetToken.isUsed()) {
            throw new BadRequestException("Liên kết này đã được sử dụng");
        }
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Liên kết đặt lại mật khẩu đã hết hạn");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}