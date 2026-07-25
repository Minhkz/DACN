package com.haui.repository;

import com.haui.entity.ProductFilter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface ProductFilterRepository extends JpaRepository<ProductFilter, Integer> {
    void deleteByProductId(Integer id);

    List<ProductFilter> findByProductId(Integer id);

    List<ProductFilter> findByProductIdIn(List<Integer> ids);

    @Query("SELECT pf1.product.id FROM ProductFilter pf1 " +
            "WHERE pf1.filter.id = :categoryFilterId AND pf1.product.id <> :excludeProductId")
    List<Integer> findProductIdsByFilterIdAndProductIdNot(Integer categoryFilterId, Integer excludeProductId);
}
