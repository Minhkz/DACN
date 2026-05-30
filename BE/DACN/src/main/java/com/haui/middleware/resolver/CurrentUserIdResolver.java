package com.haui.middleware.resolver;

import com.haui.middleware.annotation.CurrentUserId;
import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class CurrentUserIdResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUserId.class)
                && parameter.getParameterType().equals(Integer.class);
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        CurrentUserId currentUserId =
                parameter.getParameterAnnotation(CurrentUserId.class);

        boolean required = currentUserId == null || currentUserId.required();

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken
                || authentication.getPrincipal() == null) {

            if (!required) {
                return null;
            }

            throw new RuntimeException("Unauthorized");
        }

        Integer userId = convertPrincipalToInteger(authentication.getPrincipal());

        if (userId == null) {
            if (!required) {
                return null;
            }

            throw new RuntimeException("Cannot resolve current user id");
        }

        return userId;
    }

    private Integer convertPrincipalToInteger(Object principal) {
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