package com.haui.service.pay.impl;

import com.haui.config.VNPayConfig;
import com.haui.service.pay.VNPayService;
import com.haui.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayServiceImpl implements VNPayService {
    private final VNPayConfig cfg;

    @Override
    public String createPaymentUrl(
            long amountVnd,
            String orderInfo,
            String txnRef,
            HttpServletRequest request
    ) throws UnsupportedEncodingException {

        Map<String, String> params = new HashMap<>();

        params.put("vnp_Version", cfg.getVersion());
        params.put("vnp_Command", cfg.getCommand());
        params.put("vnp_TmnCode", cfg.getTmnCode());

        long amount = amountVnd * 100L;

        params.put("vnp_Amount", Long.toString(amount));

        params.put("vnp_CurrCode", cfg.getCurrCode());
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", VNPayUtil.removeAccent(orderInfo));
        params.put("vnp_OrderType", cfg.getOrderType());
        params.put("vnp_Locale", cfg.getLocale());
        params.put("vnp_ReturnUrl", cfg.getReturnUrl());

        String ip = VNPayUtil.getClientIp(request);

        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
            ip = "127.0.0.1";
        }

        params.put("vnp_IpAddr", ip);

        Calendar cal = Calendar.getInstance(
                TimeZone.getTimeZone("Asia/Ho_Chi_Minh")
        );

        SimpleDateFormat fmt =
                new SimpleDateFormat("yyyyMMddHHmmss");

        params.put(
                "vnp_CreateDate",
                fmt.format(cal.getTime())
        );

        cal.add(Calendar.MINUTE, 15);

        params.put(
                "vnp_ExpireDate",
                fmt.format(cal.getTime())
        );

        System.out.println("VNPay Amount = " + amount);
        System.out.println("VNPay IP = " + ip);

        return cfg.getPayUrl() + "?" + buildQueryAndHash(params);
    }

    @Override
    public boolean verifySignature(Map<String, String> params, String secureHash) {
        try {
            List<String> fieldNames = new ArrayList<>(params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            Iterator<String> it = fieldNames.iterator();
            while (it.hasNext()) {
                String name = it.next();
                String value = params.get(name);
                if (value != null && !value.isEmpty()) {
                    hashData.append(name).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                    if (it.hasNext()) hashData.append('&');
                }
            }
            String checkHash = VNPayUtil.hmacSHA512(cfg.getHashSecret(), hashData.toString());
            return checkHash.equalsIgnoreCase(secureHash);
        } catch (Exception e) {
            return false;
        }
    }

    private String buildQueryAndHash(Map<String, String> params) throws UnsupportedEncodingException {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> it = fieldNames.iterator();
        while (it.hasNext()) {
            String name = it.next();
            String value = params.get(name);
            if (value != null && !value.isEmpty()) {
                hashData.append(name).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(name, StandardCharsets.US_ASCII)).append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                if (it.hasNext()) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }
        String secureHash = VNPayUtil.hmacSHA512(cfg.getHashSecret(), hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);
        return query.toString();
    }
}
