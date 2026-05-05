package com.haui.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND("404", "User not found", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("409", "User already exists", HttpStatus.CONFLICT),
    ROLE_NOT_FOUND("404", "Role not found", HttpStatus.NOT_FOUND),
    USERNAME_ALREADY_EXISTS("409", "Username already exists", HttpStatus.CONFLICT),
    EMAIL_ALREADY_EXISTS("409", "Email already exists", HttpStatus.CONFLICT),
    USER_PASSWORD_INCORRECT("401", "Password is incorrect", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_NOT_FOUND("404", "Refresh token not found", HttpStatus.NOT_FOUND),
    REFRESH_TOKEN_EXPIRED("401", "Refresh token expired", HttpStatus.UNAUTHORIZED),
    INVALID_REFRESH_TOKEN("400", "Invalid refresh token", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_REVOKED("401", "Refresh token has been revoked", HttpStatus.UNAUTHORIZED),
    FILTER_ALREADY_EXISTS("409", "Filter already exists", HttpStatus.CONFLICT),
    FILTER_NOT_FOUND("404", "Filter not found", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND("404", "Product not found", HttpStatus.NOT_FOUND),
    PRODUCT_ALREADY_EXISTS("409", "Product already exists", HttpStatus.CONFLICT),
    PRODUCT_FILTER_NOT_FOUND("404", "Some filters not found", HttpStatus.NOT_FOUND),
    PRODUCT_OUT_OF_STOCK("400", "Product is out of stock or quantity is not enough", HttpStatus.BAD_REQUEST),
    CART_NOT_FOUND("404", "Cart not found", HttpStatus.NOT_FOUND),
    CART_ALREADY_EXISTS("409", "Cart already exists for this user", HttpStatus.CONFLICT),
    CART_ITEM_NOT_FOUND("404", "Cart item not found", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND("404", "Order not found", HttpStatus.NOT_FOUND),
    AVATAR_ALREADY_EXISTS("400", "Avatar already exists for this user", HttpStatus.CONFLICT),
    MISSING_FIELD("400", "Missing required field", HttpStatus.BAD_REQUEST),
    REVIEW_NOT_FOUND("404", "Review not found", HttpStatus.NOT_FOUND),
    WISHLIST_NOT_FOUND("404", "Wishlist not found", HttpStatus.NOT_FOUND),
    WISHLIST_ALREADY_EXISTS("409", "Wishlist already exists", HttpStatus.CONFLICT),
    WISHLIST_ITEM_NOT_FOUND("404", "Wishlist item not found", HttpStatus.NOT_FOUND),
    WISHLIST_ITEM_ALREADY_EXISTS("409", "Wishlist item already exists", HttpStatus.CONFLICT),
    WISHLIST_USER_NOT_FOUND("404", "Wishlist user not found", HttpStatus.NOT_FOUND),
    PRODUCT_CART_NOT_FOUND("404", "Product cart not found", HttpStatus.NOT_FOUND),
    INVALID_QUANTITY("400", "Invalid quantity", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST("400", "Invalid request", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(String code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
