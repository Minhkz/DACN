package com.haui.repository;

import com.haui.entity.Filter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FilterRepository extends JpaRepository<Filter, Integer> {
    Boolean existsByNameAndType(String name, String type);
    Boolean existsByNameAndTypeAndIdNot(String name, String type, Integer id);

    @Query("SELECT f FROM Filter f JOIN ProductFilter pf ON pf.filter.id = f.id " +
            "WHERE pf.product.id = :productId AND f.type = 'type'")
    Optional<Filter> findCategoryByProductId(Integer productId);


    @Query("SELECT f FROM Filter f JOIN ProductFilter pf ON pf.filter.id = f.id " +
            "WHERE pf.product.id = :productId AND f.type = :type")
    List<Filter> findByProductIdAndType(Integer productId, String type);
}
