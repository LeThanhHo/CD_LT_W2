package com.example.bike_shop.controller;

import com.example.bike_shop.dto.ChatDTO;
import com.example.bike_shop.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class AIChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatDTO.ChatResponse> chat(@Valid @RequestBody ChatDTO.ChatRequest request) {
        return ResponseEntity.ok(chatService.reply(request.getMessage()));
    }
}
