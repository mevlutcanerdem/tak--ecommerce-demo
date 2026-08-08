package com.takidemo.backend.service;

import com.takidemo.backend.dto.common.PageResponse;
import com.takidemo.backend.dto.product.ProductResponse;
import com.takidemo.backend.entity.Category;
import com.takidemo.backend.entity.Product;
import com.takidemo.backend.exception.ResourceNotFoundException;
import com.takidemo.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    private ProductService productService;

    private Category ringCategory;
    private Product ring;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productRepository);

        ringCategory = Category.builder()
                .id(1L)
                .name("Yüzükler")
                .slug("yuzukler")
                .imageUrl("https://images.unsplash.com/photo-1720093601709-66ce9c0068a1?w=800&q=80")
                .build();

        ring = Product.builder()
                .id(1L)
                .slug("zarif-pirlanta-tektas-yuzuk")
                .name("Zarif Pırlanta Tektaş Yüzük")
                .description("Test açıklaması")
                .price(new BigDecimal("8999.90"))
                .discountPrice(new BigDecimal("7499.90"))
                .material("18 Ayar Beyaz Altın")
                .stock(8)
                .rating(4.9)
                .featured(true)
                .isNew(false)
                .images(List.of("https://images.unsplash.com/photo-1561812350-932aed735105?w=800&q=80"))
                .category(ringCategory)
                .build();
    }

    @Test
    void getBySlug_returnsMappedProduct_whenFound() {
        when(productRepository.findBySlug("zarif-pirlanta-tektas-yuzuk")).thenReturn(Optional.of(ring));

        ProductResponse response = productService.getBySlug("zarif-pirlanta-tektas-yuzuk");

        assertThat(response.getName()).isEqualTo("Zarif Pırlanta Tektaş Yüzük");
        assertThat(response.getPrice()).isEqualByComparingTo("8999.90");
        assertThat(response.getDiscountPrice()).isEqualByComparingTo("7499.90");
        assertThat(response.getCategory().getSlug()).isEqualTo("yuzukler");
        assertThat(response.getIsNew()).isFalse();
        assertThat(response.getImages()).hasSize(1);
    }

    @Test
    void getBySlug_throwsNotFound_whenMissing() {
        when(productRepository.findBySlug("bilinmeyen")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getBySlug("bilinmeyen"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getFeatured_returnsOnlyFeaturedProducts() {
        when(productRepository.findByFeaturedTrue()).thenReturn(List.of(ring));

        List<ProductResponse> featured = productService.getFeatured();

        assertThat(featured).hasSize(1);
        assertThat(featured.get(0).getFeatured()).isTrue();
    }

    @Test
    void getProducts_returnsPageResponse_withPaginationMetadata() {
        Page<Product> page = new PageImpl<>(List.of(ring), PageRequest.of(0, 12), 1);
        when(productRepository.findAll(any(Specification.class), any(PageRequest.class))).thenReturn(page);

        PageResponse<ProductResponse> result = productService.getProducts("yuzukler", null, "price_asc", 0, 12);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getTotalPages()).isEqualTo(1);
        assertThat(result.getPage()).isEqualTo(0);
        assertThat(result.getSize()).isEqualTo(12);
    }
}
