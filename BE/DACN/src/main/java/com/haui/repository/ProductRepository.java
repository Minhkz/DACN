package com.haui.repository;

import com.haui.dto.response.product.ProductDto;
import com.haui.entity.Product;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
    Boolean existsByName(String name);

    Boolean existsByNameAndIdNot(String name, Integer id);

    @Query("""
    select distinct p
    from Product p
    where exists (
        select 1
        from ProductFilter pf
        where pf.product = p
          and pf.filter.type = 'type'
          and lower(pf.filter.name) = lower(:type)
    )
""")
    Page<Product> findAllByType(@Param("type") String type, Pageable pageable);

}
