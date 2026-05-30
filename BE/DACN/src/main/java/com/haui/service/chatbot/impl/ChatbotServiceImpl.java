package com.haui.service.chatbot.impl;

import com.haui.dto.request.chatbot.ChatRequest;
import com.haui.dto.response.chatbot.*;
import com.haui.entity.Product;
import com.haui.entity.ProductVector;
import com.haui.event.ChatbotMessageEvent;
import com.haui.repository.ProductVectorRepository;
import com.haui.service.chatbot.ChatbotService;
import com.haui.service.kafka.KafkaProducerService;
import com.haui.utils.VectorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {

    private final ChatModel chatModel;
    private final EmbeddingModel embeddingModel;
    private final ProductVectorRepository productVectorRepository;
    private final KafkaProducerService kafkaProducerService;

    @Value("${app.analytics.rag-top-k:3}")
    private int topK;

    @Override
    @Transactional(readOnly = true)
    public ChatResponse ask(Integer userId, ChatRequest request) {
        String question = request.getMessage();

        float[] questionEmbedding = embeddingModel.embed(question);

        List<Double> questionVector = VectorUtil.parseJsonArray(
                VectorUtil.toJsonArray(questionEmbedding)
        );

        List<ProductVector> topVectors = productVectorRepository.findAll()
                .stream()
                .sorted(
                        Comparator.comparingDouble(
                                vector -> -VectorUtil.cosineSimilarity(
                                        questionVector,
                                        VectorUtil.parseJsonArray(vector.getEmbeddingJson())
                                )
                        )
                )
                .limit(topK)
                .toList();

        List<Product> products = topVectors.stream()
                .map(ProductVector::getProduct)
                .filter(Objects::nonNull)
                .toList();

        String context = buildContext(products);

        String prompt = """
            Bạn là chatbot tư vấn bán laptop cho website thương mại điện tử.

            Chỉ trả lời dựa trên dữ liệu sản phẩm bên dưới.
            Nếu không có dữ liệu phù hợp, hãy nói rằng hiện chưa tìm thấy sản phẩm phù hợp.

            Dữ liệu sản phẩm:
            %s

            Câu hỏi khách hàng:
            %s

            Hãy trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu.
        """.formatted(context, question);

        String answer = chatModel.call(prompt);

        kafkaProducerService.sendChatbotMessageEvent(
                ChatbotMessageEvent.builder()
                        .userId(userId)
                        .question(question)
                        .answer(answer)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        List<ChatProductDto> productDtos = products.stream()
                .map(product -> ChatProductDto.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .avatar(product.getAvatar())
                        .price(product.getPrice())
                        .build())
                .toList();

        return ChatResponse.builder()
                .answer(answer)
                .products(productDtos)
                .build();
    }

    private String buildContext(List<Product> products) {
        if (products.isEmpty()) {
            return "Không có sản phẩm phù hợp.";
        }

        StringBuilder builder = new StringBuilder();

        for (Product product : products) {
            builder.append("- Tên: ").append(product.getName()).append("\n");
            builder.append("  Giá: ").append(product.getPrice()).append("\n");
            builder.append("  Mô tả: ").append(product.getDescription()).append("\n");
            builder.append("  Còn hàng: ").append(product.getQuantity()).append("\n");
            builder.append("  Đã bán: ").append(product.getSold()).append("\n\n");
        }

        return builder.toString();
    }
}