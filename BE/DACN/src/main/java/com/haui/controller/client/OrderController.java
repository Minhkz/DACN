package com.haui.controller.client;


import com.haui.dto.request.order.client.OrderCancelRequest;
import com.haui.dto.request.order.OrderRequest;
import com.haui.dto.request.order.client.OrderDetailRequest;
import com.haui.dto.response.PageResponse;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.order.OrderDto;
import com.haui.middleware.annotation.CurrentUserId;
import com.haui.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
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
    public ResponseResult<PageResponse<OrderDto>> getMyOrders(
            @CurrentUserId Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<String> sort
    ) {

        Page<OrderDto> result = orderService.getOrders(userId, page, size, sort);

        return ResponseResult.success(PageResponse.from(result));
    }

    @PostMapping("/detail")
    public ResponseResult<OrderDto> detail(@CurrentUserId Integer userId,
                                                         @RequestBody @Valid OrderDetailRequest request){
        return ResponseResult.success(orderService.findById(userId, request));
    }

    @DeleteMapping
    public ResponseResult<Void> cancelOrder(
            @CurrentUserId Integer userId,
            @RequestBody @Valid OrderCancelRequest request

    ) {
        orderService.cancel(userId, request);
        return ResponseResult.success();
    }

}