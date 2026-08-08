package com.takidemo.backend.service;

import com.takidemo.backend.dto.order.CreateOrderRequest;
import com.takidemo.backend.dto.order.OrderItemRequest;
import com.takidemo.backend.dto.order.OrderItemResponse;
import com.takidemo.backend.dto.order.OrderResponse;
import com.takidemo.backend.entity.Order;
import com.takidemo.backend.entity.OrderItem;
import com.takidemo.backend.entity.Product;
import com.takidemo.backend.entity.User;
import com.takidemo.backend.exception.BadRequestException;
import com.takidemo.backend.exception.ResourceNotFoundException;
import com.takidemo.backend.repository.OrderRepository;
import com.takidemo.backend.repository.ProductRepository;
import com.takidemo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String authenticatedEmail) {
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .email(request.getEmail())
                .fullName(request.getShipping().getFullName())
                .phone(request.getShipping().getPhone())
                .address(request.getShipping().getAddress())
                .city(request.getShipping().getCity())
                .postalCode(request.getShipping().getPostalCode())
                .build();

        if (authenticatedEmail != null) {
            userRepository.findByEmail(authenticatedEmail).ifPresent(order::setUser);
        }

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + itemRequest.getProductId()));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new BadRequestException("Yetersiz stok: " + product.getName());
            }

            BigDecimal unitPrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            OrderItem item = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .price(unitPrice)
                    .quantity(itemRequest.getQuantity())
                    .subtotal(subtotal)
                    .build();

            order.addItem(item);
            total = total.add(subtotal);

            product.setStock(product.getStock() - itemRequest.getQuantity());
        }

        order.setTotal(total);
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    public OrderResponse getOrderByNumber(String orderNumber) {
        // Looked up by the random, non-sequential order number (not the DB primary key) so a
        // guest confirmation link can't be used to enumerate other customers' orders (IDOR).
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı: " + orderNumber));
        return toResponse(order);
    }

    public List<OrderResponse> getOrdersForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    private String generateOrderNumber() {
        String timestamp = DateTimeFormatter.ofPattern("yyyyMMdd").withZone(ZoneOffset.UTC).format(Instant.now());
        String suffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "TK-" + timestamp + "-" + suffix;
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus().name())
                .total(order.getTotal())
                .items(items)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
