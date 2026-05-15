package com.haui.controller.client;


import com.haui.dto.request.order.OrderCancelRequest;
import com.haui.dto.request.order.OrderRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.order.OrderDto;
import com.haui.middleware.annotation.CurrentUserId;
import com.haui.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {

    OrderService orderService;

    @PostMapping
    public ResponseResult<OrderDto> create(
            @RequestBody @Valid OrderRequest request,
            @CurrentUserId Integer userId
    ) {

        return ResponseResult.success(
                orderService.create(userId, request)
        );
    }

    @GetMapping("/me")
    public ResponseResult<List<OrderDto>> getMyOrders(
            @CurrentUserId Integer userId
    ) {

        return ResponseResult.success(
                orderService.findByUserId(userId)
        );
    }

    @DeleteMapping
    public ResponseResult<Void> cancelOrder(
            @CurrentUserId Integer userId,
            @RequestBody @Valid OrderCancelRequest request

    ) {

        return ResponseResult.success();
    }

}