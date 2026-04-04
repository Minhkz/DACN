package com.haui.service;

import com.haui.dto.request.order.OrderRequest;
import com.haui.dto.request.order.OrderUpdateRequest;
import com.haui.dto.response.order.OrderDto;

import java.util.List;

public interface OrderService {
    OrderDto create(OrderRequest request);
    List<OrderDto> getAll();
    List<OrderDto> getByUserId(Integer userId);
    OrderDto getById(Integer id);
    OrderDto update(Integer id, OrderUpdateRequest request);
    void delete(Integer id);
}
