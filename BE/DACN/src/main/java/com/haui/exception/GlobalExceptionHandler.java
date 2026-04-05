package com.haui.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorDetails> handleAppException(AppException ex,
                                                           WebRequest request){

        ErrorCode errorCode = ex.getErrorCode();

        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                errorCode.getMessage(),
                request.getDescription(false),
                errorCode.getCode(),
                ex.getField(),
                null
        );

        return new ResponseEntity<>(errorDetails, errorCode.getStatus());
    }
}
