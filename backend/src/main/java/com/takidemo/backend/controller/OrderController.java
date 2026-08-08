package com.takidemo.backend.controller;

import com.takidemo.backend.dto.order.CreateOrderRequest;
import com.takidemo.backend.dto.order.OrderResponse;
import com.takidemo.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request, Authentication authentication) {
        String email = (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal()))
                ? authentication.getName()
                : null;
        return orderService.createOrder(request, email);
    }

    @GetMapping("/{orderNumber}")
    public OrderResponse getOrder(@PathVariable String orderNumber) {
        return orderService.getOrderByNumber(orderNumber);
    }

    @GetMapping
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        return orderService.getOrdersForUser(authentication.getName());
    }
}
