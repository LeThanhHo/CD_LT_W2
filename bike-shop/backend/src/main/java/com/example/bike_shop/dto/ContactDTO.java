package com.example.bike_shop.dto;

import com.example.bike_shop.entity.enums.ContactStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDTO {
    private Long id;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullname;

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;

    private String phone;

    @NotBlank(message = "Nội dung liên hệ không được để trống")
    private String message;

    private ContactStatus status;
    private LocalDateTime createdAt;
}
