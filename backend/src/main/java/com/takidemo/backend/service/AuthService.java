package com.takidemo.backend.service;

import com.takidemo.backend.dto.auth.LoginRequest;
import com.takidemo.backend.dto.auth.LoginResponse;
import com.takidemo.backend.dto.auth.RegisterRequest;
import com.takidemo.backend.dto.auth.UserResponse;
import com.takidemo.backend.entity.Role;
import com.takidemo.backend.entity.User;
import com.takidemo.backend.exception.DuplicateEmailException;
import com.takidemo.backend.exception.ResourceNotFoundException;
import com.takidemo.backend.repository.UserRepository;
import com.takidemo.backend.security.JwtService;
import com.takidemo.backend.security.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final LoginAttemptService loginAttemptService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Bu e-posta adresi zaten kayıtlı");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    public LoginResponse login(LoginRequest request) {
        loginAttemptService.assertNotLocked(request.getEmail());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (BadCredentialsException ex) {
            loginAttemptService.onLoginFailed(request.getEmail());
            throw ex;
        }

        loginAttemptService.onLoginSucceeded(request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .build();

        // Only non-sensitive identity fields go into the JWT payload — it is base64-encoded,
        // not encrypted, and readable by anyone holding the token.
        Map<String, Object> claims = Map.of(
                "id", user.getId(),
                "role", user.getRole().name());
        String token = jwtService.generateToken(userDetails, claims);

        return LoginResponse.builder()
                .token(token)
                .user(toUserResponse(user))
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        return toUserResponse(user);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
