package com.takidemo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.takidemo.backend.dto.order.CreateOrderRequest;
import com.takidemo.backend.dto.order.OrderItemRequest;
import com.takidemo.backend.dto.order.ShippingRequest;
import com.takidemo.backend.entity.Category;
import com.takidemo.backend.entity.Product;
import com.takidemo.backend.repository.CategoryRepository;
import com.takidemo.backend.repository.OrderRepository;
import com.takidemo.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductAndOrderTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    private Product seededProduct;

    @BeforeEach
    void seedCatalog() {
        // Each test method re-seeds a fresh product/category — the H2 schema and Spring
        // context are shared across test methods in this class, so clear prior data first.
        // Orders (and their order_items) must go before products/categories due to FKs.
        orderRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        Category category = categoryRepository.save(Category.builder()
                .name("Kolyeler")
                .slug("kolyeler")
                .imageUrl("https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80")
                .build());

        seededProduct = productRepository.save(Product.builder()
                .name("Altın Kalp Kolye")
                .slug("altin-kalp-kolye")
                .description("Test için kolye")
                .price(new BigDecimal("1499.90"))
                .discountPrice(new BigDecimal("1199.90"))
                .material("18 Ayar Altın")
                .stock(12)
                .rating(4.8)
                .featured(true)
                .isNew(false)
                .images(List.of("https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80"))
                .category(category)
                .build());
    }

    @Test
    void getProducts_returnsSeededProduct_filteredByCategory() throws Exception {
        mockMvc.perform(get("/api/products").param("category", "kolyeler"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].slug").value("altin-kalp-kolye"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void getProductBySlug_returnsFullProductShape() throws Exception {
        mockMvc.perform(get("/api/products/altin-kalp-kolye"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Altın Kalp Kolye"))
                .andExpect(jsonPath("$.category.slug").value("kolyeler"))
                .andExpect(jsonPath("$.isNew").value(false));
    }

    @Test
    void createOrder_asGuest_persistsAndReturnsReceivedStatus() throws Exception {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setItems(List.of(new OrderItemRequest(seededProduct.getId(), 2)));
        request.setShipping(new ShippingRequest("Zeynep Kaya", "5551112233", "Örnek Mah. No:1", "İstanbul", "34000"));
        request.setEmail("guest@example.com");

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("RECEIVED"))
                .andExpect(jsonPath("$.orderNumber", org.hamcrest.Matchers.notNullValue()))
                .andExpect(jsonPath("$.total").value(2399.80))
                .andExpect(jsonPath("$.items[0].quantity").value(2));
    }

    @Test
    void createOrder_withEmptyCart_returns400() throws Exception {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setItems(List.of());
        request.setShipping(new ShippingRequest("Zeynep Kaya", "5551112233", "Örnek Mah. No:1", "İstanbul", "34000"));
        request.setEmail("guest@example.com");

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
