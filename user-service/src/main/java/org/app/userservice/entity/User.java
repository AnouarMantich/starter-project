package org.app.userservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID keycloakId; // same as Keycloak `sub` claim

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private boolean profileCompleted = false;

    private String fullName;
    private String phone;
    private String role;
    private LocalDateTime createdAt = LocalDateTime.now();
}