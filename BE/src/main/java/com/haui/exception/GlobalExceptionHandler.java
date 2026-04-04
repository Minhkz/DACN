package com.haui.exception;

import org.springframework.http.HttpStatus;
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
                                                           WebRequest request) {

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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDetails> handleValidation(MethodArgumentNotValidException ex,
                                                         WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                "Validation failed",
                request.getDescription(false),
                "400",
                null,
                errors
        );

        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleException(Exception ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false),
                "500",
                null,
                null
        );

        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
