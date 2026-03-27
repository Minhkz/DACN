package com.haui.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.haui.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

}
