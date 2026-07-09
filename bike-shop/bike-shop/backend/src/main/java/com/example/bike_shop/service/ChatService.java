package com.example.bike_shop.service;

import com.example.bike_shop.dto.ChatDTO;

public interface ChatService {
    ChatDTO.ChatResponse reply(String message);
}
