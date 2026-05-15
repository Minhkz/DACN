package com.haui.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND("404", "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("409", "Người dùng đã tồn tại", HttpStatus.CONFLICT),
    ROLE_NOT_FOUND("404", "Không tìm thấy vai trò", HttpStatus.NOT_FOUND),
    USERNAME_ALREADY_EXISTS("409", "Tên đăng nhập đã tồn tại", HttpStatus.CONFLICT),
    EMAIL_ALREADY_EXISTS("409", "Email đã tồn tại", HttpStatus.CONFLICT),
    USER_PASSWORD_INCORRECT("401", "Mật khẩu không chính xác", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_NOT_FOUND("404", "Không tìm thấy refresh token", HttpStatus.NOT_FOUND),
    REFRESH_TOKEN_EXPIRED("401", "Refresh token đã hết hạn", HttpStatus.UNAUTHORIZED),
    INVALID_REFRESH_TOKEN("400", "Refresh token không hợp lệ", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_REVOKED("401", "Refresh token đã bị thu hồi", HttpStatus.UNAUTHORIZED),

    FILTER_ALREADY_EXISTS("409", "Bộ lọc đã tồn tại", HttpStatus.CONFLICT),
    FILTER_NOT_FOUND("404", "Không tìm thấy bộ lọc", HttpStatus.NOT_FOUND),

    PRODUCT_NOT_FOUND("404", "Không tìm thấy sản phẩm", HttpStatus.NOT_FOUND),
    PRODUCT_ALREADY_EXISTS("409", "Sản phẩm đã tồn tại", HttpStatus.CONFLICT),
    PRODUCT_FILTER_NOT_FOUND("404", "Không tìm thấy một số bộ lọc của sản phẩm", HttpStatus.NOT_FOUND),
    PRODUCT_OUT_OF_STOCK("400", "Sản phẩm đã hết hàng hoặc số lượng không đủ", HttpStatus.BAD_REQUEST),

    CART_NOT_FOUND("404", "Không tìm thấy giỏ hàng", HttpStatus.NOT_FOUND),
    CART_ALREADY_EXISTS("409", "Giỏ hàng đã tồn tại cho người dùng này", HttpStatus.CONFLICT),
    CART_ITEM_NOT_FOUND("404", "Không tìm thấy sản phẩm trong giỏ hàng", HttpStatus.NOT_FOUND),

    ORDER_NOT_FOUND("404", "Không tìm thấy đơn hàng", HttpStatus.NOT_FOUND),
    ORDER_ALREADY_CANCELLED("400", "Đơn hàng đã được hủy", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_CANCEL("400", "Không thể hủy đơn hàng ở trạng thái hiện tại", HttpStatus.BAD_REQUEST),

    AVATAR_ALREADY_EXISTS("400", "Ảnh đại diện đã tồn tại cho người dùng này", HttpStatus.CONFLICT),
    MISSING_FIELD("400", "Thiếu trường bắt buộc", HttpStatus.BAD_REQUEST),

    REVIEW_NOT_FOUND("404", "Không tìm thấy đánh giá", HttpStatus.NOT_FOUND),

    WISHLIST_NOT_FOUND("404", "Không tìm thấy danh sách yêu thích", HttpStatus.NOT_FOUND),
    WISHLIST_ALREADY_EXISTS("409", "Danh sách yêu thích đã tồn tại", HttpStatus.CONFLICT),
    WISHLIST_ITEM_NOT_FOUND("404", "Không tìm thấy sản phẩm trong danh sách yêu thích", HttpStatus.NOT_FOUND),
    WISHLIST_ITEM_ALREADY_EXISTS("409", "Sản phẩm đã tồn tại trong danh sách yêu thích", HttpStatus.CONFLICT),
    WISHLIST_USER_NOT_FOUND("404", "Không tìm thấy người dùng của danh sách yêu thích", HttpStatus.NOT_FOUND),

    PRODUCT_CART_NOT_FOUND("404", "Không tìm thấy sản phẩm trong giỏ hàng", HttpStatus.NOT_FOUND),

    INVALID_QUANTITY("400", "Số lượng không hợp lệ", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_ENOUGH("400", "Sản phẩm không đủ số lượng", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST("400", "Yêu cầu không hợp lệ", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(String code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}