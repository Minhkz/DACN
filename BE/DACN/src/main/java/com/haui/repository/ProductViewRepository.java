package com.haui.repository;

import com.haui.dto.response.analytics.ProductViewStatsDto;
import com.haui.entity.ProductView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface ProductViewRepository extends JpaRepository<ProductView, Integer> {

    @Query("""
        SELECT new com.haui.dto.response.analytics.ProductViewStatsDto(
            p.id,
            p.name,
            p.avatar,
            COUNT(pv.id)
        )
        FROM ProductView pv
        JOIN pv.product p
        GROUP BY p.id, p.name, p.avatar
        ORDER BY COUNT(pv.id) DESC
    """)
    List<ProductViewStatsDto> findTopProductViews(Pageable pageable);
}