package com.haui.controller.admin;

import com.haui.dto.request.order.admin.OrderStatusUpdateRequest;
import com.haui.dto.response.PageResponse;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.order.OrderDto;
import com.haui.dto.response.order.admin.OrderAdminDto;
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
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class OrderAdminController {
    OrderService orderService;

    @GetMapping
    public ResponseResult<PageResponse<OrderAdminDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<String> sort
    ) {
        Page<OrderAdminDto> result= orderService.getAllOrders(page, size, sort);
        return ResponseResult.success(PageResponse.from(result));
    }

    
    @GetMapping("/{id}")
    public ResponseResult<OrderAdminDto> detail(
            @PathVariable Integer id
    ) {

        return ResponseResult.success(
                orderService.detail(id)
        );
    }

    @PatchMapping("/{id}")
    public ResponseResult<OrderAdminDto> updateStatus(
            @PathVariable Integer id,
            @RequestBody @Valid OrderStatusUpdateRequest request
    ) {

        return ResponseResult.success(
                orderService.updateStatus(id, request)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseResult<Void> delete(
            @PathVariable Integer id
    ) {

        orderService.delete(id);

        return ResponseResult.success(null);
    }
}
