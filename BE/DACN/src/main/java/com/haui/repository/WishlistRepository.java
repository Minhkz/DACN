package com.haui.repository;

import com.haui.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    Optional<Wishlist> findByUserId(Integer userId);
    boolean existsByUserId(Integer userId);
}
