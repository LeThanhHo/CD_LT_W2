package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.BrandDTO;
import com.example.bike_shop.entity.Brand;
import com.example.bike_shop.exception.BadRequestException;
import com.example.bike_shop.exception.ResourceNotFoundException;
import com.example.bike_shop.mapper.BrandMapper;
import com.example.bike_shop.repository.BrandRepository;
import com.example.bike_shop.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    @Override
    public List<BrandDTO> getAll() {
        return brandRepository.findAll().stream()
                .map(brandMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BrandDTO getById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hãng id=" + id));
        return brandMapper.toDTO(brand);
    }

    @Override
    public BrandDTO create(BrandDTO dto) {
        if (brandRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Tên hãng đã tồn tại");
        }
        Brand brand = brandMapper.toEntity(dto);
        return brandMapper.toDTO(brandRepository.save(brand));
    }

    @Override
    public BrandDTO update(Long id, BrandDTO dto) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hãng id=" + id));
        brandMapper.updateEntityFromDTO(dto, brand);
        return brandMapper.toDTO(brandRepository.save(brand));
    }

    @Override
    public void delete(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy hãng id=" + id);
        }
        brandRepository.deleteById(id);
    }
}
