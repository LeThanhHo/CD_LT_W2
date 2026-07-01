package com.example.bike_shop.service.impl;

import com.example.bike_shop.dto.ProductDTO;
import com.example.bike_shop.entity.Brand;
import com.example.bike_shop.entity.Category;
import com.example.bike_shop.entity.Product;
import com.example.bike_shop.exception.ResourceNotFoundException;
import com.example.bike_shop.mapper.ProductMapper;
import com.example.bike_shop.repository.BrandRepository;
import com.example.bike_shop.repository.CategoryRepository;
import com.example.bike_shop.repository.ProductRepository;
import com.example.bike_shop.service.ProductService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductMapper productMapper;

    @Override
    public Page<ProductDTO> searchProducts(String keyword, Long categoryId, Long brandId,
                                            BigDecimal minPrice, BigDecimal maxPrice,
                                            String sortBy, Pageable pageable) {

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (brandId != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), brandId));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable sortedPageable = pageable;
        if (sortBy != null) {
            Sort sort = switch (sortBy) {
                case "price_asc" -> Sort.by("price").ascending();
                case "price_desc" -> Sort.by("price").descending();
                case "newest" -> Sort.by("createdAt").descending();
                case "name_asc" -> Sort.by("name").ascending();
                default -> Sort.unsorted();
            };
            sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }

        return productRepository.findAll(spec, sortedPageable).map(productMapper::toDTO);
    }

    @Override
    public ProductDTO getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm id=" + id));
        return productMapper.toDTO(product);
    }

    @Override
    public ProductDTO create(ProductDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục id=" + dto.getCategoryId()));
        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hãng id=" + dto.getBrandId()));

        Product product = productMapper.toEntity(dto, category, brand);
        return productMapper.toDTO(productRepository.save(product));
    }

    @Override
    public ProductDTO update(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm id=" + id));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục id=" + dto.getCategoryId()));
        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hãng id=" + dto.getBrandId()));

        productMapper.updateEntityFromDTO(dto, product, category, brand);
        return productMapper.toDTO(productRepository.save(product));
    }

    @Override
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm id=" + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDTO> getFeatured() {
        return productRepository.findAll(PageRequest.of(0, 8)).stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getNewest() {
        return productRepository.findAll(PageRequest.of(0, 8, Sort.by("createdAt").descending()))
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }
}
