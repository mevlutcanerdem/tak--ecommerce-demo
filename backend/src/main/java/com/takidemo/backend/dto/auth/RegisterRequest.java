package com.takidemo.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "İsim boş olamaz")
    @Size(max = 150, message = "İsim en fazla 150 karakter olabilir")
    private String name;

    @NotBlank(message = "E-posta boş olamaz")
    @Email(message = "Geçerli bir e-posta adresi giriniz")
    @Size(max = 200)
    private String email;

    @NotBlank(message = "Şifre boş olamaz")
    @Size(min = 8, max = 100, message = "Şifre en az 8 karakter olmalıdır")
    private String password;
}
