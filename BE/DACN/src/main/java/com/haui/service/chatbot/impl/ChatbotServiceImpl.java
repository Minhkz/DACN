package com.haui.service.chatbot.impl;

import com.haui.dto.request.chatbot.ChatRequest;
import com.haui.dto.response.chatbot.*;
import com.haui.entity.Product;
import com.haui.entity.ProductVector;
import com.haui.event.ChatbotMessageEvent;
import com.haui.repository.ProductVectorRepository;
import com.haui.service.chatbot.ChatbotService;
import com.haui.service.cloudinary.CloudinaryService;
import com.haui.service.kafka.KafkaProducerService;
import com.haui.utils.VectorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {

    private final ChatModel chatModel;
    private final EmbeddingModel embeddingModel;
    private final ProductVectorRepository productVectorRepository;
    private final KafkaProducerService kafkaProducerService;
    private final CloudinaryService cloudinaryService;

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
            Bạn là trợ lý tư vấn bán laptop cho website thương mại điện tử.
        
            QUY TẮC BẮT BUỘC:
            1. Chỉ được sử dụng thông tin trong phần "Dữ liệu sản phẩm" bên dưới. 
               Tuyệt đối không suy đoán, không bịa thêm thông số, giá, khuyến mãi hay sản phẩm không có trong dữ liệu.
            2. Nếu dữ liệu không có sản phẩm phù hợp với câu hỏi, trả lời đúng câu: 
               "Hiện chưa tìm thấy sản phẩm phù hợp với yêu cầu của bạn."
               Không cố gắng gợi ý sản phẩm gần đúng nếu nó không thực sự đáp ứng yêu cầu.
            3. Nếu câu hỏi khách hàng không rõ ràng (thiếu ngân sách, mục đích sử dụng...), 
               hãy hỏi lại 1 câu ngắn để làm rõ thay vì đoán.
            4. Khi có sản phẩm phù hợp, ưu tiên nêu: tên sản phẩm, cấu hình nổi bật liên quan đến nhu cầu, giá.
            5. Không nhắc đến việc bạn đang dựa vào "dữ liệu" hay "context" — trả lời tự nhiên như nhân viên tư vấn thật.
        
            Dữ liệu sản phẩm:
            %s
        
            Câu hỏi khách hàng:
            %s
        
            Trả lời bằng tiếng Việt, giọng văn thân thiện, ngắn gọn, tối đa 3 câu.
    """.formatted(context, question);

        String answer;

        try {
            answer = chatModel.call(prompt);
        } catch (Exception e) {
            answer = buildFallbackAnswer(products);
        }

        kafkaProducerService.sendChatbotMessageEvent(
                ChatbotMessageEvent.builder()
                        .userId(userId)
                        .question(question)
                        .answer(answer)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        Map<String, String> imageUrlCache = new HashMap<>();

        List<ChatProductDto> productDtos = products.stream()
                .map(product -> ChatProductDto.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .avatar(convertWithCache(product.getAvatar(), imageUrlCache))
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

    private String buildFallbackAnswer(List<Product> products) {
        if (products.isEmpty()) {
            return "Hiện chưa tìm thấy sản phẩm phù hợp với yêu cầu của bạn.";
        }

        StringBuilder builder = new StringBuilder();
        builder.append("Mình tìm thấy một số sản phẩm có thể phù hợp:\n");

        for (Product product : products) {
            builder.append("- ")
                    .append(product.getName())
                    .append(" - Giá: ")
                    .append(product.getPrice())
                    .append(" VNĐ.\n");
        }

        return builder.toString();
    }

    private String convertWithCache(String avatar, Map<String, String> cache) {
        if (avatar == null || avatar.isBlank()) {
            return null;
        }

        return cache.computeIfAbsent(avatar, cloudinaryService::getImageUrl);
    }
}