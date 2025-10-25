package com.capitec.auth.controller;

import com.capitec.auth.dto.*;
import com.capitec.auth.service.AuthService;
import com.capitec.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'DISPUTE_ADMIN')")
    public ResponseEntity<UserDTO> getUser(@RequestParam UUID userId) {
        UserDTO user = userService.getUserByUserId(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO) {
        UserDTO user = userService.updateUser(userDTO);
        return ResponseEntity.ok(user);
    }
}
