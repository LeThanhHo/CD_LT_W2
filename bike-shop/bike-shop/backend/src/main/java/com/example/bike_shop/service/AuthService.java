package com.example.bike_shop.service;

import com.example.bike_shop.dto.AuthDTO;

public interface AuthService {
    AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request);
    AuthDTO.AuthResponse login(AuthDTO.LoginRequest request);
}
