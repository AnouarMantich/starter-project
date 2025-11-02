package org.app.userservice.service;

import org.app.userservice.dto.UserResponse;
import org.app.userservice.dto.UserUpdateDto;
import org.app.userservice.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {
    User getOrCreateUser(UUID keycloakId, String email, String fullName, String role);

    // --- Admin methods ---
    Page<UserResponse> findAll(Pageable pageable);

    UserResponse findById(UUID id);

    void deleteById(UUID id);

    UserResponse updateProfile(UUID keycloakId, UserUpdateDto updateDto);
}
