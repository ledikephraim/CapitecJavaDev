package com.capitec.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginRequestDTO {
    private String username;
    private String password;
}
