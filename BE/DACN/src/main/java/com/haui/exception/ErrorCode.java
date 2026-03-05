package com.haui.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND("USER_404", "User not found", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("USER_409", "User already exists", HttpStatus.CONFLICT),
    ROLE_NOT_FOUND("ROLE_404", "Role not found", HttpStatus.NOT_FOUND),
    USERNAME_ALREADY_EXISTS("USER_409", "Username already exists",  HttpStatus.CONFLICT),
    EMAIL_ALREADY_EXISTS("USER_409", "Email already exists", HttpStatus.CONFLICT),
    USER_PASSWORD_INCORRECT("AUTH_401", "Password is incorrect", HttpStatus.UNAUTHORIZED),
    INVALID_REQUEST("REQ_400", "Invalid request", HttpStatus.BAD_REQUEST);


    private final String code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(String code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
