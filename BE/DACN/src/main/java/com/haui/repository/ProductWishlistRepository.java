package com.haui.repository;

import com.haui.entity.ProductWishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductWishlistRepository extends JpaRepository<ProductWishlist, Integer> {
    boolean existsByWishlistIdAndProductId(Integer wishlistId, Integer productId);

    Optional<ProductWishlist> findByWishlistIdAndProductId(Integer wishlistId, Integer productId);
}
