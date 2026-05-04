package com.haui.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Unauthenticated");
        }

        return (Long) authentication.getPrincipal();
    }

    public static Integer getCurrentUserIdAsInt() {
        return getCurrentUserId().intValue();
    }
}
