package com.haui.repository;

import com.haui.entity.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductOrderRepository extends JpaRepository<ProductOrder, Integer> {
    List<ProductOrder> findByOrderId(Integer orderId);
    void deleteByOrderId(Integer orderId);

    // Lấy toàn bộ order_id đã từng chứa productId
    @Query("SELECT po.order.id FROM ProductOrder po WHERE po.product.id = :productId")
    List<Integer> findOrderIdsByProductId(Integer productId);

    // Đếm số đơn (distinct) chứa từng sản phẩm khác, trong tập order_id cho trước
    @Query("SELECT po.product.id, COUNT(DISTINCT po.order.id) FROM ProductOrder po " +
            "WHERE po.order.id IN :orderIds AND po.product.id <> :excludeProductId " +
            "GROUP BY po.product.id")
    List<Object[]> countCoOccurrence(List<Integer> orderIds, Integer excludeProductId);

    // Đếm số đơn (distinct) chứa 1 sản phẩm cụ thể
    @Query("SELECT COUNT(DISTINCT po.order.id) FROM ProductOrder po WHERE po.product.id = :productId")
    Long countOrdersContaining(Integer productId);

    // Tổng số đơn hàng distinct trong toàn hệ thống
    @Query("SELECT COUNT(DISTINCT po.order.id) FROM ProductOrder po")
    Long countTotalOrders();
}
