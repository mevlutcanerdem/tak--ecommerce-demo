package com.takidemo.backend.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotEmpty(message = "Sepet boş olamaz")
    @Size(max = 50, message = "Sepette en fazla 50 kalem olabilir")
    @Valid
    private List<OrderItemRequest> items;

    @NotNull(message = "Teslimat bilgileri boş olamaz")
    @Valid
    private ShippingRequest shipping;

    @NotBlank(message = "E-posta boş olamaz")
    @Email(message = "Geçerli bir e-posta adresi giriniz")
    @Size(max = 200)
    private String email;
}
