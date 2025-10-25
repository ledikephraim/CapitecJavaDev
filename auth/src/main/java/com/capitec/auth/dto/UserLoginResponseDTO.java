package com.capitec.auth.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Set;

@Data
@Builder
public class UserLoginResponseDTO {
    private Set<String> roles;
    private String token;
}
