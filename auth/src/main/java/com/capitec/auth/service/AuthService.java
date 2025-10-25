package com.capitec.auth.service;

import com.capitec.auth.dto.UserLoginRequestDTO;
import com.capitec.auth.dto.UserLoginResponseDTO;
import com.capitec.auth.dto.UserRegistrationRequestDTO;
import com.capitec.auth.dto.UserRegistrationResponseDTO;
import com.capitec.auth.model.User;
import com.capitec.auth.model.UserRole;
import com.capitec.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authManager;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public UserRegistrationResponseDTO register(UserRegistrationRequestDTO dto) {
        User user = User.builder()
                .firstname(dto.getFirstName())
                .lastname(dto.getLastName())
                .username(dto.getUsername())
                .password(encoder.encode(dto.getPassword()))
                .email(dto.getEmail())
                .enabled(true)
                .build();

        UserRole userRole = UserRole.builder()
                .roleName(dto.getRole())
                .user(user)
                .build();

        user.setRoles(Set.of(userRole));
        userRepository.save(user);
        return  UserRegistrationResponseDTO.builder()
                .message("User registered successfully.")
                .username(user.getUsername())
                .build();
    }

    public UserLoginResponseDTO login(UserLoginRequestDTO dto) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
            );

            User user = userRepository.findByUsername(dto.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            Set<String> roles = user.getRoles()
                    .stream()
                    .map(UserRole::getRoleName)
                    .collect(Collectors.toSet());

            String token = jwtService.generateToken(user.getId(), dto.getUsername(), roles);

            return UserLoginResponseDTO.builder()
                    .token(token)
                    .roles(roles)
                    .build();

        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }
}

