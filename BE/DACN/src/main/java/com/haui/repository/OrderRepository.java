package com.haui.repository;

import com.haui.entity.Order;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Override
    @EntityGraph(attributePaths = {
            "user",
            "productOrders",
            "productOrders.product"
    })
    Page<Order> findAll(Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT o FROM Order o
        WHERE o.id = :orderId
        AND o.user.id = :userId
    """)
    Optional<Order> findByIdAndUserIdForUpdate(@Param("orderId") Integer orderId,
                                               @Param("userId") Integer userId);

    @Query("""
    SELECT DISTINCT o
    FROM Order o
    LEFT JOIN FETCH o.productOrders po
    LEFT JOIN FETCH po.product p
    LEFT JOIN FETCH o.user u
    WHERE o.id = :orderId
""")
    Optional<Order> findAdminDetailById(Integer orderId);
}
