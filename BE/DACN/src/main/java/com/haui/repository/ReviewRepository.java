package com.haui.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import com.haui.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // 1. Lấy danh sách review theo product
    List<Review> findByProductId(Integer productId);

    // 2. Đếm số review theo product
    Integer countByProductId(Integer productId);

    // 3. Tính rating trung bình
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Integer productId);

    
}