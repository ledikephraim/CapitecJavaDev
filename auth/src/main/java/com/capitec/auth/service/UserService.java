package com.capitec.auth.service;

import com.capitec.auth.dto.*;
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

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authManager;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public UserDTO getUserByUserId(UUID userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"))   ;

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .enabled(user.isEnabled())
                .build();
    }

    public UserDTO updateUser(UserDTO userDTO) {

        User userModel = userRepository.findById(userDTO.getId()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        userModel.setFirstname(userDTO.getFirstname());
        userModel.setLastname(userDTO.getLastname());
        userModel.setEmail(userDTO.getEmail());
        userModel.setEnabled(userDTO.isEnabled());
        userRepository.save(userModel);

        return userDTO;

    }
}

