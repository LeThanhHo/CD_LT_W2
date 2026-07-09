package com.example.bike_shop.service;

import com.example.bike_shop.dto.BrandDTO;

import java.util.List;

public interface BrandService {
    List<BrandDTO> getAll();
    BrandDTO getById(Long id);
    BrandDTO create(BrandDTO dto);
    BrandDTO update(Long id, BrandDTO dto);
    void delete(Long id);
}
