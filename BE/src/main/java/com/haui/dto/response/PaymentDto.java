package com.haui.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentDto {
    private String status;
    private String message;
    private String paymentUrl;
}
