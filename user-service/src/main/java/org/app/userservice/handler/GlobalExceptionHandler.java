package org.app.userservice.handler;

import jakarta.servlet.http.HttpServletRequest;
import org.app.userservice.exception.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 🔹 Helper method to build the error response
    private ErrorResponse buildError(String code, String message, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .code(code)
                .message(message)
                .path(path)
                .build();
    }

    // 🔹 Validation errors (e.g., @NotBlank, @Email)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorResponse error = buildError("VALIDATION_ERROR", errors, req.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST.value()).body(error);
    }

    // 🔹 Business logic / custom exceptions
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatus(ResponseStatusException ex, HttpServletRequest req) {
        HttpStatusCode statusCode = ex.getStatusCode();  // Spring 6 type
        int numericStatus = statusCode.value();         // numeric status for ResponseEntity

        ErrorResponse error = buildError("BUSINESS_ERROR", ex.getReason(), req.getRequestURI());
        return ResponseEntity.status(numericStatus).body(error);
    }

    // 🔹 Generic fallback for unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, HttpServletRequest req) {
        ErrorResponse error = buildError("INTERNAL_ERROR", ex.getMessage(), req.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR.value()).body(error);
    }
}

