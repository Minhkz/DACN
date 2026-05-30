package com.haui.repository;

import com.haui.dto.response.analytics.AbandonedCartRawDto;
import com.haui.dto.response.analytics.CartAdditionStatsDto;
import com.haui.entity.CartEvent;
import com.haui.enums.CartEventType;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CartEventRepository extends JpaRepository<CartEvent, Integer> {

    @Query("""
        SELECT new com.haui.dto.response.analytics.CartAdditionStatsDto(
            p.id,
            p.name,
            p.avatar,
            COUNT(ce.id),
            COALESCE(SUM(ce.quantity), 0)
        )
        FROM CartEvent ce
        JOIN ce.product p
        WHERE ce.actionType = :actionType
        GROUP BY p.id, p.name, p.avatar
        ORDER BY COUNT(ce.id) DESC
    """)
    List<CartAdditionStatsDto> findTopAddToCartProducts(
            @Param("actionType") CartEventType actionType,
            Pageable pageable
    );

    @Query("""
        SELECT new com.haui.dto.response.analytics.AbandonedCartRawDto(
            c.id,
            u.id,
            u.username,
            u.fullName,
            u.email,
            MAX(ce.createdAt)
        )
        FROM Cart c
        JOIN c.user u
        JOIN ProductCart pc ON pc.cart = c
        LEFT JOIN CartEvent ce ON ce.cart = c
        GROUP BY c.id, u.id, u.username, u.fullName, u.email
        HAVING MAX(ce.createdAt) < :threshold OR MAX(ce.createdAt) IS NULL
        ORDER BY MAX(ce.createdAt) ASC
    """)
    List<AbandonedCartRawDto> findAbandonedCartRaw(
            @Param("threshold") LocalDateTime threshold
    );
}
