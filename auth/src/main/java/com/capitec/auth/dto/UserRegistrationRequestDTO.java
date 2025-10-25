package com.capitec.auth.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Data
@Builder
public class UserRegistrationRequestDTO {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
