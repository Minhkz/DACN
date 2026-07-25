package com.haui.service.pay;

import jakarta.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;
import java.util.Map;

public interface VNPayService {

    String createPaymentUrl(long amountVnd, String orderInfo, String txnRef, HttpServletRequest request)
            throws UnsupportedEncodingException;

    boolean verifySignature(Map<String, String> params, String secureHash);
}