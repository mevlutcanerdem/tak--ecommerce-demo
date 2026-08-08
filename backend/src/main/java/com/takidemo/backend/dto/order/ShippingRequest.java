package com.takidemo.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingRequest {

    @NotBlank(message = "Ad soyad boş olamaz")
    @Size(max = 150, message = "Ad soyad en fazla 150 karakter olabilir")
    private String fullName;

    @NotBlank(message = "Telefon boş olamaz")
    @Size(max = 30, message = "Telefon en fazla 30 karakter olabilir")
    private String phone;

    @NotBlank(message = "Adres boş olamaz")
    @Size(max = 300, message = "Adres en fazla 300 karakter olabilir")
    private String address;

    @NotBlank(message = "Şehir boş olamaz")
    @Size(max = 100, message = "Şehir en fazla 100 karakter olabilir")
    private String city;

    @NotBlank(message = "Posta kodu boş olamaz")
    @Size(max = 20, message = "Posta kodu en fazla 20 karakter olabilir")
    private String postalCode;
}
