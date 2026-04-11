package com.haui.repository;

import com.haui.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {

    Optional<Wishlist> findByUserIdAndProductId(Integer userId, Integer productId);

    List<Wishlist> findByUserId(Integer userId);

    void deleteByUserIdAndProductId(Integer userId, Integer productId);

    boolean existsByUserIdAndProductId(Integer userId, Integer productId);
}