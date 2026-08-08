package com.takidemo.backend.dto.order;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {

    @NotNull(message = "Ürün id boş olamaz")
    private Long productId;

    @NotNull(message = "Adet boş olamaz")
    @Min(value = 1, message = "Adet en az 1 olmalıdır")
    @Max(value = 99, message = "Adet en fazla 99 olabilir")
    private Integer quantity;
}
