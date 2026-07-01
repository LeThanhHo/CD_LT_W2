package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.AuthDTO;
import com.example.bike_shop.entity.User;
import com.example.bike_shop.entity.enums.RoleName;
import com.example.bike_shop.exception.BadRequestException;
import com.example.bike_shop.mapper.UserMapper;
import com.example.bike_shop.repository.UserRepository;
import com.example.bike_shop.security.JwtService;
import com.example.bike_shop.security.UserPrincipal;
import com.example.bike_shop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

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
}
