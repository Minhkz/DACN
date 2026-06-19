package com.haui.controller.client;

import com.haui.dto.request.pay.CreatePaymentRequest;
import com.haui.dto.response.ResponseResult;
import com.haui.service.OrderService;
import com.haui.service.pay.VNPayService;
import com.haui.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;
    private final OrderService orderService;

    private static final String FRONTEND_RESULT_URL = "http://localhost:3000/payment/result";

    @PostMapping("/vnpay/create")
    public ResponseResult<Map<String, String>> createPayment(
            @RequestBody CreatePaymentRequest req,
            HttpServletRequest httpReq
    ) {
        try {

            String txnRef =
                    String.valueOf(req.orderId());

            String paymentUrl =
                    vnPayService.createPaymentUrl(
                            req.amount(),
                            req.orderInfo(),
                            txnRef,
                            httpReq
                    );

            return ResponseResult.success(
                    Map.of("paymentUrl", paymentUrl)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseResult.fail(e.getMessage());
        }
    }


    @GetMapping("/vnpay/return")
    public void handleReturn(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        Map<String, String> params = extractParams(request);

        String secureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        boolean valid = vnPayService.verifySignature(
                params,
                secureHash
        );

        String responseCode = params.get("vnp_ResponseCode");
        String orderId = params.get("vnp_TxnRef");

        if (valid) {
            if ("00".equals(responseCode)) {
                orderService.markPaid(
                        Integer.parseInt(orderId)
                );
            } else {
                orderService.markPaymentFailed(
                        Integer.parseInt(orderId)
                );
            }
        }

        String redirect =
                valid && "00".equals(responseCode)
                        ? FRONTEND_RESULT_URL
                          + "?status=success&orderId="
                          + orderId
                        : FRONTEND_RESULT_URL
                          + "?status=fail&orderId="
                          + orderId;

        response.sendRedirect(redirect);
    }


    private Map<String, String> extractParams(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((k, v) -> params.put(k, v[0]));
        return params;
    }
}