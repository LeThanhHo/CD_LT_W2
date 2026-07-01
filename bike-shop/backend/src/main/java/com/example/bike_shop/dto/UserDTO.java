package com.example.bike_shop.dto;

import com.example.bike_shop.entity.enums.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;

    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullname;

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;

    private String phone;
    private String address;
    private RoleName role;
    private LocalDateTime createdAt;
    private boolean enabled;
}
