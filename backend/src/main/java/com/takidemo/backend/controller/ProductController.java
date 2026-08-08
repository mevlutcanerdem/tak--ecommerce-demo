package com.takidemo.backend.controller;

import com.takidemo.backend.dto.common.PageResponse;
import com.takidemo.backend.dto.product.ProductResponse;
import com.takidemo.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public PageResponse<ProductResponse> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        int safeSize = Math.min(Math.max(size, 1), 100);
        return productService.getProducts(category, search, sort, page, safeSize);
    }

    @GetMapping("/featured")
    public List<ProductResponse> getFeatured() {
        return productService.getFeatured();
    }

    @GetMapping("/{slug}")
    public ProductResponse getBySlug(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }
}
