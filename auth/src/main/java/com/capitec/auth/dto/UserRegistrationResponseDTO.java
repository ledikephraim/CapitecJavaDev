package com.capitec.auth.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
public class UserRegistrationResponseDTO {
    private String message;
    private String username;
}
