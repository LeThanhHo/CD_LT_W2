package com.example.bike_shop.service;

import com.example.bike_shop.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getByUser(Long userId);
    long countUnread(Long userId);
    void markRead(Long userId, Long notificationId);
    void markAllRead(Long userId);
    void notifyUser(Long userId, String title, String message);
}
