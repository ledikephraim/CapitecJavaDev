package com.capitec.auth.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_roles", schema = "authentication")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roleName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
