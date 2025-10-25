package com.capitec.auth.controller;

import com.capitec.auth.dto.UserLoginRequestDTO;
import com.capitec.auth.dto.UserRegistrationRequestDTO;
import com.capitec.auth.dto.UserRegistrationResponseDTO;
import com.capitec.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponseDTO> register(@RequestBody UserRegistrationRequestDTO dto) {
        UserRegistrationResponseDTO userRegistrationResponseDTO = authService.register(dto);
        return ResponseEntity.ok(userRegistrationResponseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDTO dto) {
        try {
            return ResponseEntity.ok(authService.login(dto));
        } catch (Exception ex) {
            if (ex.getMessage().contains("Invalid username or password")) {
                return ResponseEntity.status(401).body(ex.getMessage());
            }
            return ResponseEntity.status(500).body("Authentication failed: " + ex.getMessage());
        }
    }
}
