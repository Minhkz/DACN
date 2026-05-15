package com.haui.repository;

import com.haui.dto.response.product.ProductDto;
import com.haui.entity.Product;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
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



    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Product p
        SET p.quantity = p.quantity - :quantity,
            p.sold = p.sold + :quantity
        WHERE p.id = :productId
        AND p.quantity >= :quantity
    """)
    int decreaseStockAndIncreaseSold(@Param("productId") Integer productId,
                                     @Param("quantity") Integer quantity);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Product p
        SET p.quantity = p.quantity + :quantity,
            p.sold = p.sold - :quantity
        WHERE p.id = :productId
        AND p.sold >= :quantity
    """)
    int restoreStockAndDecreaseSold(@Param("productId") Integer productId,
                                    @Param("quantity") Integer quantity);


}
