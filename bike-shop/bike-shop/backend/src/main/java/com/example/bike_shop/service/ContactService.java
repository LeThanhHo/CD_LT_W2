package com.example.bike_shop.service;

import com.example.bike_shop.dto.ContactDTO;

import java.util.List;

public interface ContactService {
    ContactDTO submit(ContactDTO dto);
    List<ContactDTO> getAll();
    ContactDTO markProcessed(Long id);
    void delete(Long id);
}
