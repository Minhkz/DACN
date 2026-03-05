package com.haui.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorDetails(
        LocalDateTime time,
        String message,
        String details,
        String errorCode,
        String field,
        Map<String, String> errors
) {
}
