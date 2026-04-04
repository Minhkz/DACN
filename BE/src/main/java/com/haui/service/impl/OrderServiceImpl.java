package com.haui.service.impl;
import com.haui.dto.request.order.OrderItemRequest;
import com.haui.dto.request.order.OrderRequest;
import com.haui.dto.request.order.OrderUpdateRequest;
import com.haui.dto.response.order.OrderDto;
import com.haui.dto.response.order.OrderItemDto;
import com.haui.dto.response.product.ProductDetailDto;
import com.haui.entity.Order;
import com.haui.entity.Product;
import com.haui.entity.ProductFilter;
import com.haui.entity.ProductImg;
import com.haui.entity.ProductOrder;
import com.haui.entity.User;
import com.haui.exception.AppException;
import com.haui.exception.ErrorCode;
import com.haui.repository.OrderRepository;
import com.haui.repository.ProductFilterRepository;
import com.haui.repository.ProductImgRepository;
import com.haui.repository.ProductOrderRepository;
import com.haui.repository.ProductRepository;
import com.haui.repository.UserRepository;
import com.haui.service.OrderService;
import com.haui.service.cloudinary.CloudinaryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;
    ProductOrderRepository productOrderRepository;
    ProductRepository productRepository;
    UserRepository userRepository;
    ProductImgRepository productImgRepository;
    ProductFilterRepository productFilterRepository;
    CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public OrderDto create(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(request.getStatus() == null ? 0 : request.getStatus());
        order.setCreatedDate(LocalDateTime.now());
        order.setTotalPrice(BigDecimal.ZERO);
        orderRepository.save(order);

        BigDecimal total = buildOrderItems(order, request.getItems());
        order.setTotalPrice(total);
        orderRepository.save(order);
        return toDto(order);
    }

    @Override
    public List<OrderDto> getAll() {
        return orderRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public List<OrderDto> getByUserId(Integer userId) {
        return orderRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    @Override
    public OrderDto getById(Integer id) {
        return toDto(getOrder(id));
    }

    @Override
    @Transactional
    public OrderDto update(Integer id, OrderUpdateRequest request) {
        Order order = getOrder(id);

        restoreStock(order);
        productOrderRepository.deleteByOrderId(id);

        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(request.getStatus() == null ? order.getStatus() : request.getStatus());

        BigDecimal total = buildOrderItems(order, request.getItems());
        order.setTotalPrice(total);
        orderRepository.save(order);
        return toDto(order);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Order order = getOrder(id);
        restoreStock(order);
        productOrderRepository.deleteByOrderId(id);
        orderRepository.delete(order);
    }

    private Order getOrder(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
    }

    private Product getProduct(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    private BigDecimal buildOrderItems(Order order, List<OrderItemRequest> requests) {
        List<ProductOrder> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest request : requests) {
            Product product = getProduct(request.getProductId());
            validateProductQuantity(product, request.getQuantity());

            ProductOrder item = new ProductOrder();
            item.setOrder(order);
            item.setProduct(product);
            item.setPrice(product.getPrice());
            item.setQuantity(request.getQuantity());
            items.add(item);

            product.setQuantity(product.getQuantity() - request.getQuantity());
            product.setSold((product.getSold() == null ? 0 : product.getSold()) + request.getQuantity());
            productRepository.save(product);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
        }

        productOrderRepository.saveAll(items);
        return total;
    }

    private void restoreStock(Order order) {
        List<ProductOrder> currentItems = productOrderRepository.findByOrderId(order.getId());
        for (ProductOrder item : currentItems) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            product.setSold(Math.max(0, (product.getSold() == null ? 0 : product.getSold()) - item.getQuantity()));
            productRepository.save(product);
        }
    }

    private void validateProductQuantity(Product product, Integer quantity) {
        if (quantity == null || quantity <= 0 || product.getQuantity() == null || product.getQuantity() < quantity) {
            throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
        }
    }

    private ProductDetailDto toProductDetailDto(Product product) {
        List<ProductImg> images = productImgRepository.findByProductId(product.getId());
        List<ProductFilter> filters = productFilterRepository.findByProductId(product.getId());

        ProductDetailDto dto = new ProductDetailDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setSold(product.getSold());
        dto.setView(product.getView());
        dto.setAvatar(cloudinaryService.getImageUrl(product.getAvatar()));
        dto.setImgs(images.stream().map(ProductImg::getSrc).map(cloudinaryService::getImageUrl).toList());
        dto.setFilters(filters.stream().map(f -> f.getFilter().getName()).toList());
        return dto;
    }

    private OrderDto toDto(Order order) {
        List<ProductOrder> items = productOrderRepository.findByOrderId(order.getId());
        List<OrderItemDto> itemDtos = items.stream().map(item -> {
            OrderItemDto dto = new OrderItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setProductAvatar(cloudinaryService.getImageUrl(item.getProduct().getAvatar()));
            dto.setPrice(item.getPrice());
            dto.setQuantity(item.getQuantity());
            dto.setProduct(toProductDetailDto(item.getProduct()));
            dto.setSubTotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return dto;
        }).toList();

        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setUsername(order.getUser().getUsername());
        dto.setStatus(order.getStatus());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setCreatedDate(order.getCreatedDate());
        dto.setItems(itemDtos);
        return dto;
    }
}
