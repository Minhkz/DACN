package com.haui.repository;

import com.haui.entity.ProductCart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductCartRepository extends JpaRepository<ProductCart, Integer> {
    List<ProductCart> findByCartId(Integer cartId);
    Optional<ProductCart> findByCartIdAndProductId(Integer cartId, Integer productId);
    void deleteByCartId(Integer cartId);
}
