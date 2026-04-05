package com.haui.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException{
    private final ErrorCode errorCode;
    private final String field;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.field = null;
    }

    public AppException(ErrorCode errorCode, String field) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.field = field;
    }
}
