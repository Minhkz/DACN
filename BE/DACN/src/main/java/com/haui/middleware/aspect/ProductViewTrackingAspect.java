package com.haui.middleware.aspect;


import com.haui.event.ProductViewEvent;
import com.haui.service.kafka.KafkaProducerService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.*;

import java.time.LocalDateTime;

@Aspect
@Component
@RequiredArgsConstructor
public class ProductViewTrackingAspect {

    private final KafkaProducerService kafkaProducerService;

    @AfterReturning("@annotation(com.haui.middleware.annotation.TrackProductView)")
    public void trackProductView(JoinPoint joinPoint) {
        Integer productId = extractProductId(joinPoint.getArgs());

        if (productId == null) {
            return;
        }

        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes == null) {
            return;
        }

        HttpServletRequest request = attributes.getRequest();

        ProductViewEvent event = ProductViewEvent.builder()
                .userId(getCurrentUserId())
                .productId(productId)
                .sessionId(request.getSession().getId())
                .ipAddress(request.getRemoteAddr())
                .viewedAt(LocalDateTime.now())
                .build();

        kafkaProducerService.sendProductViewEvent(event);
    }

    private Integer extractProductId(Object[] args) {
        for (Object arg : args) {
            if (arg instanceof Integer value) {
                return value;
            }

            if (arg instanceof Long value) {
                return value.intValue();
            }
        }

        return null;
    }

    private Integer getCurrentUserId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof Integer value) {
            return value;
        }

        if (principal instanceof Long value) {
            return value.intValue();
        }

        if (principal instanceof String value) {
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException e) {
                return null;
            }
        }

        return null;
    }
}
