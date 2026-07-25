package com.haui.service.impl;

import com.haui.dto.request.order.client.OrderCancelRequest;
import com.haui.dto.request.order.OrderItemRequest;
import com.haui.dto.request.order.OrderRequest;
import com.haui.dto.request.order.admin.OrderStatusUpdateRequest;
import com.haui.dto.request.order.client.OrderDetailRequest;
import com.haui.dto.request.order.client.OrderUpdateRequest;
import com.haui.dto.response.order.OrderDto;
import com.haui.dto.response.order.admin.OrderAdminDto;
import com.haui.dto.response.order.admin.OrderAdminItemDto;
import com.haui.entity.Order;
import com.haui.entity.Product;
import com.haui.entity.ProductOrder;
import com.haui.entity.User;
import com.haui.enums.OrderStatus;
import com.haui.enums.PaymentStatus;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.mapper.OrderMapper;
import com.haui.mapper.ProductOrderMapper;
import com.haui.repository.OrderRepository;
import com.haui.repository.ProductOrderRepository;
import com.haui.repository.ProductRepository;
import com.haui.repository.UserRepository;
import com.haui.service.OrderService;
import com.haui.service.cloudinary.CloudinaryService;
import com.haui.utils.PageableUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;
    ProductOrderRepository productOrderRepository;
    UserRepository userRepository;
    OrderMapper orderMapper;
    ProductOrderMapper productOrderMapper;
    ProductRepository productRepository;
    CloudinaryService cloudinaryService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderDto create(Integer userId, OrderRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order = orderMapper.toCreate(request);
        order.setUser(user);

        BigDecimal totalPrice = BigDecimal.ZERO;

        Order savedOrder = orderRepository.save(order);

        for (OrderItemRequest itemRequest : request.getProducts()) {

            Integer productId = itemRequest.getProductId();
            Integer quantity = itemRequest.getQty();

            if (productId == null) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            if (quantity == null || quantity <= 0) {
                throw new AppException(ErrorCode.INVALID_QUANTITY);
            }

            int updatedRows = productRepository.decreaseStockAndIncreaseSold(productId, quantity);

            if (updatedRows == 0) {
                throw new AppException(ErrorCode.PRODUCT_NOT_ENOUGH);
            }

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            ProductOrder productOrder =
                    productOrderMapper.toCreate(product, savedOrder);

            productOrder.setQuantity(quantity);

            productOrderRepository.save(productOrder);

            BigDecimal subTotal = productOrder.getPrice()
                    .multiply(BigDecimal.valueOf(quantity));

            totalPrice = totalPrice.add(subTotal);
        }

        savedOrder.setTotalPrice(totalPrice);

        Order finalOrder = orderRepository.save(savedOrder);

        return orderMapper.toDto(finalOrder);
    }

    @Override
    public OrderDto update(Integer id, OrderUpdateRequest request) {
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Integer id) {
        Order order = orderRepository.findAdminDetailById(id).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        orderRepository.delete(order);
    }

    @Override
    public OrderDto findById(Integer userId, OrderDetailRequest request) {
        Order order = orderRepository.findAdminDetailById(request.getOrderId()).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return orderMapper.toDto(order);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<OrderAdminDto> getAllOrders(int page, int size, List<String> sort) {
        Pageable pageable = PageableUtil.buildPageable(page, size, sort);

        Page<Order> orderPage = orderRepository.findAll(pageable);

        return orderPage.map(this::convertToOrderAdminDto);
    }


    @Override
    @Transactional(readOnly = true)
    public OrderAdminDto detail(Integer id) {
        Order order = orderRepository.findAdminDetailById(id).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        return convertToOrderAdminDto(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderAdminDto updateStatus(Integer id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findAdminDetailById(id).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        order.setStatus(request.getStatus());
        orderRepository.save(order);
        return convertToOrderAdminDto(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancel(Integer userId, OrderCancelRequest request) {

        if (request == null || request.getOrderId() == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        Order order = orderRepository.findByIdAndUserIdForUpdate(request.getOrderId(), userId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus().equals(OrderStatus.CANCELLED.toString())) {
            throw new AppException(ErrorCode.ORDER_ALREADY_CANCELLED);
        }

        if (order.getStatus().equals(OrderStatus.SHIPPING.toString())
                || order.getStatus().equals(OrderStatus.COMPLETED.toString())) {
            throw new AppException(ErrorCode.ORDER_CANNOT_CANCEL);
        }

        List<ProductOrder> productOrders =
                productOrderRepository.findByOrderId(order.getId());

        for (ProductOrder productOrder : productOrders) {
            int updatedRows = productRepository.restoreStockAndDecreaseSold(
                    productOrder.getProduct().getId(),
                    productOrder.getQuantity()
            );

            if (updatedRows == 0) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
        }

        order.setStatus(OrderStatus.CANCELLED.toString());

        orderRepository.save(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getOrders(int userId, int page, int size, List<String> sort) {
        Pageable pageable = PageableUtil.buildPageable(page, size, sort);

        Page<Order> orderPage = orderRepository.findByUserId(userId, pageable);

        return orderPage.map(orderMapper::toDto);
    }

    @Override
    @Transactional(rollbackFor =  Exception.class)
    public void markPaid(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new AppException(ErrorCode.ORDER_NOT_FOUND));

        order.setPaymentStatus(PaymentStatus.PAID.name());

        orderRepository.save(order);
    }

    @Override
    @Transactional(rollbackFor =  Exception.class)
    public void markPaymentFailed(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new AppException(ErrorCode.ORDER_NOT_FOUND));

        order.setStatus(PaymentStatus.FAILED.name());

        orderRepository.save(order);

    }

    private OrderAdminDto convertToOrderAdminDto(Order order) {
        OrderAdminDto dto = new OrderAdminDto();

        dto.setId(order.getId());

        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUsername(order.getUser().getUsername());
            dto.setFullName(order.getUser().getFullName());
            dto.setEmail(order.getUser().getEmail());
        }

        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());

        dto.setShippingAddress(order.getShippingAddress());
        dto.setPhone(order.getUser().getPhone());

        dto.setCreatedDate(order.getCreatedDate());

        if (order.getProductOrders() != null) {
            dto.setProducts(
                    order.getProductOrders()
                            .stream()
                            .map(this::convertToOrderAdminItemDto)
                            .toList()
            );
        }

        return dto;
    }

    private OrderAdminItemDto convertToOrderAdminItemDto(ProductOrder productOrder) {
        OrderAdminItemDto dto = new OrderAdminItemDto();

        dto.setId(productOrder.getId());
        dto.setPrice(productOrder.getPrice());
        dto.setQuantity(productOrder.getQuantity());

        if (productOrder.getProduct() != null) {
            Product product = productOrder.getProduct();

            dto.setProductId(product.getId());
            dto.setProductName(product.getName());

            if (product.getAvatar() != null && !product.getAvatar().isBlank()) {
                dto.setProductAvatar(cloudinaryService.getImageUrl(product.getAvatar()));
            }
        }

        return dto;
    }
}
