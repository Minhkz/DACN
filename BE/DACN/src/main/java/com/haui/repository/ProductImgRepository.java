package com.haui.repository;

import com.haui.entity.ProductImg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImgRepository extends JpaRepository<ProductImg, Integer> {
    void deleteByProductId(Integer id);

    List<ProductImg> findByProductId(Integer productId);

    List<ProductImg> findByProductIdIn(List<Integer> ids);

}
