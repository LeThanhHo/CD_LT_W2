package com.example.bike_shop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public class AuthDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {
        @NotBlank(message = "Username không được để trống")
        private String username;

        @NotBlank(message = "Password không được để trống")
        @Size(min = 6, message = "Password phải có ít nhất 6 ký tự")
        private String password;

        @NotBlank(message = "Họ tên không được để trống")
        private String fullname;

        @Email(message = "Email không hợp lệ")
        @NotBlank(message = "Email không được để trống")
        private String email;

        private String phone;
        private String address;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        @NotBlank(message = "Username không được để trống")
        private String username;

        @NotBlank(message = "Password không được để trống")
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String type;
        private UserDTO user;
    }
     @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ForgotPasswordRequest {
        @Email(message = "Email không hợp lệ")
        @NotBlank(message = "Email không được để trống")
        private String email;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResetPasswordRequest {
        @NotBlank(message = "Token không được để trống")
        private String token;

        @NotBlank(message = "Mật khẩu mới không được để trống")
        @Size(min = 6, message = "Mật khẩu mới phải có ít nhất 6 ký tự")
        private String newPassword;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChangePasswordRequest {
        @NotBlank(message = "Mật khẩu hiện tại không được để trống")
        private String oldPassword;

        @NotBlank(message = "Mật khẩu mới không được để trống")
        @Size(min = 6, message = "Mật khẩu mới phải có ít nhất 6 ký tự")
        private String newPassword;
    }
}
