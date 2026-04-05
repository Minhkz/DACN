package com.haui.controller.admin;

import com.haui.dto.request.order.OrderRequest;
import com.haui.dto.request.order.OrderUpdateRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.order.OrderDto;
import com.haui.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class OrderController {
    OrderService orderService;

    @PostMapping
    public ResponseResult<OrderDto> create(@RequestBody @Valid OrderRequest request) {
        return ResponseResult.success(orderService.create(request));
    }

    @GetMapping
    public ResponseResult<List<OrderDto>> getAll() {
        return ResponseResult.success(orderService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseResult<OrderDto> getById(@PathVariable Integer id) {
        return ResponseResult.success(orderService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseResult<List<OrderDto>> getByUserId(@PathVariable Integer userId) {
        return ResponseResult.success(orderService.getByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseResult<OrderDto> update(@PathVariable Integer id,
                                           @RequestBody @Valid OrderUpdateRequest request) {
        return ResponseResult.success(orderService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable Integer id) {
        orderService.delete(id);
        return ResponseResult.success("Successfully deleted order");
    }
}
