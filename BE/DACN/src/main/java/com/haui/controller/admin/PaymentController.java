package com.haui.controller.admin;

import com.haui.dto.response.ResponseResult;
import com.haui.dto.response.PaymentDto;
import com.haui.service.PaymentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
@CrossOrigin(origins = "*", maxAge = 3600)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PaymentController {

    PaymentService paymentService;

    @GetMapping("/create")
    public ResponseResult<PaymentDto> createPayment(@RequestParam long amount, @RequestParam String orderInfo) {
        PaymentDto paymentDto = paymentService.createPayment(amount, orderInfo);
        return ResponseResult.success("Success", paymentDto);
    }
}