package com.takidemo.backend.service;

import com.takidemo.backend.dto.category.CategoryResponse;
import com.takidemo.backend.dto.common.PageResponse;
import com.takidemo.backend.dto.product.ProductResponse;
import com.takidemo.backend.entity.Product;
import com.takidemo.backend.exception.ResourceNotFoundException;
import com.takidemo.backend.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public PageResponse<ProductResponse> getProducts(String category, String search, String sort, int page, int size) {
        Sort sortOrder = resolveSort(sort);
        Pageable pageable = PageRequest.of(Math.max(page, 0), size <= 0 ? 12 : size, sortOrder);

        Specification<Product> spec = buildSpecification(category, search);
        Page<Product> result = productRepository.findAll(spec, pageable);

        return PageResponse.of(result.map(this::toResponse));
    }

    public ProductResponse getBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + slug));
        return toResponse(product);
    }

    public List<ProductResponse> getFeatured() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    private Sort resolveSort(String sort) {
        if (sort == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        return switch (sort) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private Specification<Product> buildSpecification(String category, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category").get("slug"), category));
            }

            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private ProductResponse toResponse(Product product) {
        CategoryResponse categoryResponse = product.getCategory() == null ? null : CategoryResponse.builder()
                .id(product.getCategory().getId())
                .name(product.getCategory().getName())
                .slug(product.getCategory().getSlug())
                .imageUrl(product.getCategory().getImageUrl())
                .build();

        return ProductResponse.builder()
                .id(product.getId())
                .slug(product.getSlug())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .material(product.getMaterial())
                .stock(product.getStock())
                .rating(product.getRating())
                .featured(product.getFeatured())
                .isNew(product.getIsNew())
                .images(product.getImages())
                .category(categoryResponse)
                .build();
    }
}
