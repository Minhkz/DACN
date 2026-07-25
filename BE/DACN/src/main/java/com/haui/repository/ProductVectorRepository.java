package com.haui.repository;

import com.haui.entity.ProductVector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVectorRepository extends JpaRepository<ProductVector, Integer> {

    Optional<ProductVector> findByProductId(Integer productId);

    void deleteByProductId(Integer productId);

    List<ProductVector> findByProductIdIn(List<Integer> productIds);
}
