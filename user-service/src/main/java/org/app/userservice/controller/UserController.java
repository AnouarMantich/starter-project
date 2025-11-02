package org.app.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.app.userservice.dto.UserResponse;
import org.app.userservice.entity.User;
import org.app.userservice.mapper.UserMapper;
import org.app.userservice.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    // ✅ Get or create current authenticated user
    @GetMapping("/me")
    public Mono<ResponseEntity<UserResponse>> me(@AuthenticationPrincipal Jwt jwt) {
        return Mono.fromCallable(() -> {
            UUID keycloakId = UUID.fromString(jwt.getSubject());
            String email = jwt.getClaim("email");
            String fullName = jwt.getClaim("name");
            String username = jwt.getClaim("preferred_username");

            User user = service.getOrCreateUser(keycloakId, email, fullName, username);

            if (!user.isProfileCompleted()) {
                return ResponseEntity.status(HttpStatus.TEMPORARY_REDIRECT)
                        .header("X-Profile-Incomplete", "true")
                        .body(UserMapper.toResponse(user));
            }

            return ResponseEntity.ok(UserMapper.toResponse(user));
        });
    }

    // ✅ Get all users (admin only) with pagination
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        return Mono.fromCallable(() -> {
            Sort sort = direction.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();

            Pageable pageable = PageRequest.of(page, size, sort);
            return ResponseEntity.ok(service.findAll(pageable));
        });
    }

    // ✅ Get user by id (admin only)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<UserResponse>> findById(@PathVariable UUID id) {
        return Mono.fromCallable(() ->
                ResponseEntity.ok(service.findById(id))
        );
    }

    // ✅ Delete user by id (admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> deleteById(@PathVariable UUID id) {
        return Mono.fromRunnable(() -> service.deleteById(id))
                .then(Mono.just(ResponseEntity.noContent().build()));
    }
}
