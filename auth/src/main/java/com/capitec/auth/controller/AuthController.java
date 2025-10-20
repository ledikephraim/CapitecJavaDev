package com.capitec.auth.controller;

import com.capitec.auth.dto.UserLoginRequestDTO;
import com.capitec.auth.dto.UserRegistrationRequestDTO;
import com.capitec.auth.model.*;
import com.capitec.auth.repository.UserRepository;
import com.capitec.auth.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final AuthenticationManager authManager;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public String register(@RequestBody UserRegistrationRequestDTO userRegistrationRequestDTO) {
        User user = User.builder()
                .username(userRegistrationRequestDTO.getUsername())
                .password(encoder.encode(userRegistrationRequestDTO.getPassword()))
                .email(userRegistrationRequestDTO.getEmail())
                .enabled(true)
                .build();

        UserRole userRole = UserRole.builder()
                .roleName(userRegistrationRequestDTO.getRole().equalsIgnoreCase("admin") ? "DISPUTE_ADMIN" : "CUSTOMER")
                .user(user)
                .build();

        user.setRoles(Set.of(userRole));
        userRepository.save(user);
        return "User registered successfully.";
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDTO userLoginRequestDTO) {

        try {
            // Authenticate using AuthenticationManager
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userLoginRequestDTO.getUsername(), userLoginRequestDTO.getPassword())
            );

            // Load user roles from DB
            User user = userRepository.findByUsername(userLoginRequestDTO.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            Set<String> roles = user.getRoles()
                    .stream()
                    .map(UserRole::getRoleName)
                    .collect(Collectors.toSet());

            // Generate JWT token
            String token = jwtService.generateToken(user.getId(),userLoginRequestDTO.getUsername(), roles);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("roles", roles);

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Authentication failed: " + ex.getMessage());
        }
    }
}
