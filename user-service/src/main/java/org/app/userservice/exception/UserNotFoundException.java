package org.app.userservice.exception;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ResponseStatusException {
    public UserNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}