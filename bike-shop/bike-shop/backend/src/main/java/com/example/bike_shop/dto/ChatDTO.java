package com.example.bike_shop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

public class ChatDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatRequest {
        @NotBlank(message = "Nội dung tin nhắn không được để trống")
        private String message;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatResponse {
        private String reply;
        // Optional product suggestions the bot found relevant to the question,
        // so the frontend can render clickable product cards in the chat window.
        private List<ProductDTO> suggestedProducts;
    }
}
