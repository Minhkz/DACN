package com.haui.service;

import com.haui.dto.request.order.client.OrderCancelRequest;
import com.haui.dto.request.order.OrderRequest;
import com.haui.dto.request.order.admin.OrderStatusUpdateRequest;
import com.haui.dto.request.order.client.OrderDetailRequest;
import com.haui.dto.request.order.client.OrderUpdateRequest;
import com.haui.dto.response.order.OrderDto;
import com.haui.dto.response.order.admin.OrderAdminDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {
    OrderDto create(Integer userId, OrderRequest request);
    OrderDto update(Integer id, OrderUpdateRequest request);
    void delete(Integer id);

    OrderDto findById(Integer userId, OrderDetailRequest request);

    Page<OrderAdminDto> getAllOrders(int page, int size, List<String> sort);

    OrderAdminDto detail(Integer id);

    OrderAdminDto updateStatus(Integer id, @Valid OrderStatusUpdateRequest request);

    void cancel(Integer userId, OrderCancelRequest request);

    Page<OrderDto> getOrders(int userId, int page, int size, List<String> sort);
}
