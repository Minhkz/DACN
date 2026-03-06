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
    REFRESH_TOKEN_NOT_FOUND("AUTH_404", "Refresh token not found", HttpStatus.NOT_FOUND),
    REFRESH_TOKEN_EXPIRED("AUTH_401", "Refresh token expired", HttpStatus.UNAUTHORIZED),
    INVALID_REFRESH_TOKEN("AUTH_400", "Invalid refresh token", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_REVOKED("AUTH_401", "Refresh token has been revoked", HttpStatus.UNAUTHORIZED),
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
