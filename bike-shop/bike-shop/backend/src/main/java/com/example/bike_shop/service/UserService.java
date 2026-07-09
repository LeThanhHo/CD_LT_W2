package com.example.bike_shop.service;

import com.example.bike_shop.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO updateUser(Long id, UserDTO dto);
    void deleteUser(Long id);
    UserDTO getCurrentUser(String username);
}
