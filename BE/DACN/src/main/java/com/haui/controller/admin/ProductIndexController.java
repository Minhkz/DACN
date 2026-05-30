package com.haui.controller.admin;

import com.haui.dto.response.ResponseResult;
import com.haui.event.ProductIndexEvent;
import com.haui.service.kafka.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/ai/products")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class ProductIndexController {
    private final KafkaProducerService kafkaProducerService;

    @PostMapping("/{id}/index")
    public ResponseResult<Void> indexProduct(@PathVariable Integer id) {
        kafkaProducerService.sendProductIndexEvent(
                ProductIndexEvent.builder()
                        .productId(id)
                        .action("INDEX")
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        return ResponseResult.success();
    }

    @DeleteMapping("/{id}/index")
    public ResponseResult<Void> deleteProductIndex(@PathVariable Integer id) {
        kafkaProducerService.sendProductIndexEvent(
                ProductIndexEvent.builder()
                        .productId(id)
                        .action("DELETE")
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        return ResponseResult.success();
    }
}
