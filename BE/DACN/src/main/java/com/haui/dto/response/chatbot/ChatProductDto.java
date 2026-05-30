package com.haui.dto.response.chatbot;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ChatProductDto {
    private Integer id;
    private String name;
    private String avatar;
    private BigDecimal price;
}
