package com.haui.dto.response;


import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class ResponseResult<T> {
    private String datetime;
    private String errorCode;
    private String message;
    private T data;

    /* FORMAT TIME */
    private static String now() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    /* SUCCESS WITHOUT DATA */
    public static <T> ResponseResult<T> success() {
        ResponseResult<T> res = new ResponseResult<>();
        res.errorCode = "200";
        res.message = "Success";
        res.datetime = now();
        return res;
    }

    /* SUCCESS WITH DATA */
    public static <T> ResponseResult<T> success(T data) {
        ResponseResult<T> res = new ResponseResult<>();
        res.errorCode = "200";
        res.message = "Success";
        res.datetime = now();
        res.data = data;
        return res;
    }

    /* SUCCESS WITH MESSAGE + DATA */
    public static <T> ResponseResult<T> success(String message, T data) {
        ResponseResult<T> res = new ResponseResult<>();
        res.errorCode = "200";
        res.message = message;
        res.datetime = now();
        res.data = data;
        return res;
    }

    /* FAIL WITH MESSAGE */
    public static <T> ResponseResult<T> fail(String message) {
        ResponseResult<T> res = new ResponseResult<>();
        res.errorCode = "400";
        res.message = message;
        res.datetime = now();
        return res;
    }

    /* FAIL WITH MESSAGE + CUSTOM ERROR CODE */
    public static <T> ResponseResult<T> fail(String errorCode, String message) {
        ResponseResult<T> res = new ResponseResult<>();
        res.errorCode = errorCode;
        res.message = message;
        res.datetime = now();
        return res;
    }

    /* FAIL WITH MESSAGE + DATA */
    public static <T> ResponseResult<T> fail(String message, T data) {
        ResponseResult<T> res = new ResponseResult<>();
        res.errorCode = "400";
        res.message = message;
        res.data = data;
        res.datetime = now();
        return res;
    }

    /* UNAUTHORIZED */
    public static <T> ResponseResult<T> unauthorized(String message) {
        ResponseResult<T> res = new ResponseResult<>();
        res.errorCode = "401";
        res.message = message;
        res.datetime = now();
        return res;
    }

    /* SERVER ERROR */
    public static <T> ResponseResult<T> serverError(String message) {
        ResponseResult<T> res = new ResponseResult<>();
        res.errorCode = "500";
        res.message = message;
        res.datetime = now();
        return res;
    }

    public boolean isSuccess() {
        return "200".equals(this.errorCode);
    }
}
