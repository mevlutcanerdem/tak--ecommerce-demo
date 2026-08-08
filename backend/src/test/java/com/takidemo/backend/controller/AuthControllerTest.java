package com.takidemo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.takidemo.backend.dto.auth.LoginRequest;
import com.takidemo.backend.dto.auth.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerThenLogin_happyPath_returnsTokenAndUser() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("Ayşe Yılmaz", "ayse.yilmaz@example.com", "GuvenliSifre123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name").value("Ayşe Yılmaz"))
                .andExpect(jsonPath("$.email").value("ayse.yilmaz@example.com"))
                .andExpect(jsonPath("$.password").doesNotExist());

        LoginRequest loginRequest = new LoginRequest("ayse.yilmaz@example.com", "GuvenliSifre123");

        String loginResponseJson = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.email").value("ayse.yilmaz@example.com"))
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(loginResponseJson).get("token").asText();

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("ayse.yilmaz@example.com"));
    }

    @Test
    void register_rejectsWeakPassword_with400() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("Test User", "weakpass@example.com", "123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message", notNullValue()));
    }

    @Test
    void login_withWrongPassword_returns401() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("Mehmet Demir", "mehmet.demir@example.com", "DogruSifre123");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        LoginRequest loginRequest = new LoginRequest("mehmet.demir@example.com", "YanlisSifre123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void me_withoutToken_returns401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
