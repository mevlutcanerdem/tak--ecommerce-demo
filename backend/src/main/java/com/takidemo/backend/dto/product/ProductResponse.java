package com.takidemo.backend.dto.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.takidemo.backend.dto.category.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String slug;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private String material;
    private Integer stock;
    private Double rating;
    private Boolean featured;

    @JsonProperty("isNew")
    private Boolean isNew;

    private List<String> images;
    private CategoryResponse category;
}
