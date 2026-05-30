package com.haui.repository;

import com.haui.entity.ProductCart;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

public interface ProductCartRepository extends JpaRepository<ProductCart, Integer> {
    boolean existsByCartIdAndProductId(Integer cartId, Integer productId);

    List<ProductCart> findByCartId(Integer cartId);


    Optional<ProductCart> findByCartIdAndProductId(Integer cartId, Integer productId);

    @Modifying
    @Query("DELETE FROM ProductCart pc WHERE pc.cart.id = :cartId AND pc.product.id = :productId")
    void deleteByCartIdAndProductId(@Param("cartId") Integer cartId, @Param("productId") Integer productId);

    @Modifying
    @Query("DELETE FROM ProductCart pc WHERE pc.cart.id = :cartId")
    void deleteAllByCartId(@Param("cartId") Integer cartId);

    @Query("""
        SELECT pc
        FROM ProductCart pc
        JOIN FETCH pc.product p
        JOIN FETCH pc.cart c
        WHERE c.id IN :cartIds
    """)
    List<ProductCart> findByCartIdsWithProduct(
            @Param("cartIds") List<Integer> cartIds
    );
}
