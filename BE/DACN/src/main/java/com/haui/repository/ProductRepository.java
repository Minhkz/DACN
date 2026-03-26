package com.haui.repository;

import com.haui.dto.response.product.ProductDto;
import com.haui.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Boolean existsByName(String name);

    Boolean existsByNameAndIdNot(String name, Integer id);

}
