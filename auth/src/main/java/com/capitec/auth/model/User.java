package com.capitec.auth.model;

import jakarta.persistence.*;
import java.util.*;
import lombok.*;

@Entity
@Table(name = "users", schema = "authentication")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String firstname;
    private String lastname;
    private String username;
    private String password;
    private String email;
    private boolean enabled = true;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<UserRole> roles = new HashSet<>();
}
