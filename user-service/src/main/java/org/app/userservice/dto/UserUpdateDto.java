package org.app.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDto {

    @NotBlank(message = "Full name is required")
    @Size(max = 255, message = "Full name must be less than 255 characters")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @Size(max = 50, message = "Phone number must be less than 50 characters")
    private String phone;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

}