package com.haui.repository;

import com.haui.entity.ProductFilter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface ProductFilterRepository extends JpaRepository<ProductFilter, Integer> {
    void deleteByProductId(Integer id);

    List<ProductFilter> findByProductId(Integer id);

    List<ProductFilter> findByProductIdIn(List<Integer> ids);
}
