package com.capitec.auth.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Getter
@Setter
public class UserRegistrationRequestDTO {
    private String username;
    private String password;
    private String email;
    private String role;
}
