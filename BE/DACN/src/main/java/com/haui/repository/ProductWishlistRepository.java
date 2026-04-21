package com.haui.repository;

import com.haui.entity.ProductWishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductWishlistRepository extends JpaRepository<ProductWishlist, Integer> {
    List<ProductWishlist> findByWishlistId(Integer wishlistId);
    Optional<ProductWishlist> findByWishlistIdAndProductId(Integer wishlistId, Integer productId);
    boolean existsByWishlistIdAndProductId(Integer wishlistId, Integer productId);
    void deleteByWishlistId(Integer wishlistId);
}
