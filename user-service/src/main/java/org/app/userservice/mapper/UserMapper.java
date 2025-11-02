package org.app.userservice.mapper;

import org.app.userservice.dto.UserResponse;
import org.app.userservice.dto.UserUpdateDto;
import org.app.userservice.entity.User;

public final class UserMapper {

    public static UserResponse toResponse(User u) {
        if (u == null) return null;
        return UserResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .phone(u.getPhone())
                .role(u.getRole())
                .profileCompleted(u.isProfileCompleted())
                .createdAt(u.getCreatedAt())
                .build();
    }

    public static void updateEntity(User user, UserUpdateDto dto) {
        if (dto == null || user == null) return;

        if (dto.getFullName() != null && !dto.getFullName().isBlank()) {
            user.setFullName(dto.getFullName());
        }

        if (dto.getPhone() != null && !dto.getPhone().isBlank()) {
            user.setPhone(dto.getPhone());
        }

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            user.setEmail(dto.getEmail());
        }

    }



}