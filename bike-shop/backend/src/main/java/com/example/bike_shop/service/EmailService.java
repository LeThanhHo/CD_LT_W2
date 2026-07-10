package com.example.bike_shop.service;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String fullname, String resetLink);
}