package com.example.bike_shop.mapper;

import com.example.bike_shop.dto.ContactDTO;
import com.example.bike_shop.entity.Contact;
import org.springframework.stereotype.Component;

@Component
public class ContactMapper {

    public ContactDTO toDTO(Contact contact) {
        if (contact == null) return null;
        return ContactDTO.builder()
                .id(contact.getId())
                .fullname(contact.getFullname())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .message(contact.getMessage())
                .status(contact.getStatus())
                .createdAt(contact.getCreatedAt())
                .build();
    }

    public Contact toEntity(ContactDTO dto) {
        if (dto == null) return null;
        return Contact.builder()
                .fullname(dto.getFullname())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .message(dto.getMessage())
                .build();
    }
}
