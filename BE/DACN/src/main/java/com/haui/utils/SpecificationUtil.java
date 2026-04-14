package com.haui.utils;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public final class SpecificationUtil {

    private SpecificationUtil() {
    }

    public static <T> Specification<T> alwaysTrue() {
        return (root, query, cb) -> cb.conjunction();
    }

    public static <T> Specification<T> equal(String field, Object value) {
        return (root, query, cb) -> {
            if (value == null) {
                return cb.conjunction();
            }
            return cb.equal(getPath(root, field), value);
        };
    }

    public static <T> Specification<T> notEqual(String field, Object value) {
        return (root, query, cb) -> {
            if (value == null) {
                return cb.conjunction();
            }
            return cb.notEqual(getPath(root, field), value);
        };
    }

    public static <T> Specification<T> likeIgnoreCase(String field, String value) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(value)) {
                return cb.conjunction();
            }

            return cb.like(
                    cb.lower(getPath(root, field).as(String.class)),
                    "%" + value.trim().toLowerCase() + "%"
            );
        };
    }

    public static <T> Specification<T> contains(String field, String value) {
        return likeIgnoreCase(field, value);
    }

    public static <T> Specification<T> in(String field, Collection<?> values) {
        return (root, query, cb) -> {
            if (values == null || values.isEmpty()) {
                return cb.conjunction();
            }

            CriteriaBuilder.In<Object> inClause = cb.in(getPath(root, field));
            for (Object value : values) {
                inClause.value(value);
            }
            return inClause;
        };
    }

    public static <T, Y extends Comparable<? super Y>> Specification<T> greaterThanOrEqualTo(String field, Y value) {
        return (root, query, cb) -> {
            if (value == null) {
                return cb.conjunction();
            }

            Expression<Y> expression = getComparableExpression(root, field, value);
            return cb.greaterThanOrEqualTo(expression, value);
        };
    }

    public static <T, Y extends Comparable<? super Y>> Specification<T> lessThanOrEqualTo(String field, Y value) {
        return (root, query, cb) -> {
            if (value == null) {
                return cb.conjunction();
            }

            Expression<Y> expression = getComparableExpression(root, field, value);
            return cb.lessThanOrEqualTo(expression, value);
        };
    }

    public static <T, Y extends Comparable<? super Y>> Specification<T> between(String field, Y from, Y to) {
        return (root, query, cb) -> {
            if (from == null && to == null) {
                return cb.conjunction();
            }

            Y sample = from != null ? from : to;
            Expression<Y> expression = getComparableExpression(root, field, sample);

            List<Predicate> predicates = new ArrayList<>();

            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(expression, from));
            }

            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(expression, to));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static <T> Specification<T> orLikeIgnoreCase(Map<String, String> fieldValues) {
        return (root, query, cb) -> {
            if (fieldValues == null || fieldValues.isEmpty()) {
                return cb.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            for (Map.Entry<String, String> entry : fieldValues.entrySet()) {
                String field = entry.getKey();
                String value = entry.getValue();

                if (!StringUtils.hasText(field) || !StringUtils.hasText(value)) {
                    continue;
                }

                predicates.add(
                        cb.like(
                                cb.lower(getPath(root, field).as(String.class)),
                                "%" + value.trim().toLowerCase() + "%"
                        )
                );
            }

            if (predicates.isEmpty()) {
                return cb.conjunction();
            }

            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }

    @SuppressWarnings("unchecked")
    private static <T, Y> Path<Y> getPath(Root<T> root, String field) {
        validateField(field);

        String[] parts = field.split("\\.");
        Path<?> path = root.get(parts[0]);

        for (int i = 1; i < parts.length; i++) {
            path = path.get(parts[i]);
        }

        return (Path<Y>) path;
    }

    @SuppressWarnings("unchecked")
    private static <T, Y extends Comparable<? super Y>> Expression<Y> getComparableExpression(
            Root<T> root,
            String field,
            Y sampleValue
    ) {
        return getPath(root, field).as((Class<Y>) sampleValue.getClass());
    }

    private static void validateField(String field) {
        if (!StringUtils.hasText(field)) {
            throw new IllegalArgumentException("Field must not be null or blank");
        }
    }
}