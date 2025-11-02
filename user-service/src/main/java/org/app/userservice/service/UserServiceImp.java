package org.app.userservice.service;

import lombok.RequiredArgsConstructor;
import org.app.userservice.dto.UserResponse;
import org.app.userservice.dto.UserUpdateDto;
import org.app.userservice.entity.User;

import org.app.userservice.exception.UserNotFoundException;
import org.app.userservice.mapper.UserMapper;
import org.app.userservice.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UserRepository repo;
    @Override
    public User getOrCreateUser(UUID keycloakId, String email, String fullName, String role) {
        return repo.findByKeycloakId(keycloakId).orElseGet(() -> {
            User user = User.builder()
                    .keycloakId(keycloakId)
                    .email(email)
                    .fullName(fullName)
                    .profileCompleted(false) // new users must complete profile
                    .role(role)
                    .build();
            return repo.save(user);
        });
    }

    // --- Admin methods ---
    @Override
    public Page<UserResponse> findAll(Pageable pageable) {
        return repo.findAll(pageable)
                .map(UserMapper::toResponse);
    }

    @Override
    public UserResponse findById(UUID id) {
        return repo.findById(id).map(UserMapper::toResponse)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Override
    public void deleteById(UUID id) {
        if (!repo.existsById(id)) throw new UserNotFoundException("User not found");
        repo.deleteById(id);
    }
    @Override
    public UserResponse updateProfile(UUID keycloakId, UserUpdateDto updateDto) {
        User user = repo.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        UserMapper.updateEntity(user, updateDto);
        user.setProfileCompleted(true); // ✅ profile now complete

        return UserMapper.toResponse(repo.save(user));
    }

}
