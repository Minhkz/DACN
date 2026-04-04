package com.haui.repository;

import com.haui.entity.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductOrderRepository extends JpaRepository<ProductOrder, Integer> {
    List<ProductOrder> findByOrderId(Integer orderId);
    void deleteByOrderId(Integer orderId);
}
