package com.haui.utils;

import java.util.Arrays;
import java.util.List;

public class VectorUtil {

    public static String toJsonArray(float[] vector) {
        StringBuilder builder = new StringBuilder("[");

        for (int i = 0; i < vector.length; i++) {
            if (i > 0) {
                builder.append(",");
            }

            builder.append(vector[i]);
        }

        builder.append("]");

        return builder.toString();
    }

    public static List<Double> parseJsonArray(String json) {
        String content = json
                .replace("[", "")
                .replace("]", "")
                .trim();

        if (content.isBlank()) {
            return List.of();
        }

        return Arrays.stream(content.split(","))
                .map(String::trim)
                .map(Double::parseDouble)
                .toList();
    }

    public static double cosineSimilarity(List<Double> a, List<Double> b) {
        if (a.size() != b.size() || a.isEmpty()) {
            return 0.0;
        }

        double dot = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < a.size(); i++) {
            dot += a.get(i) * b.get(i);
            normA += a.get(i) * a.get(i);
            normB += b.get(i) * b.get(i);
        }

        if (normA == 0 || normB == 0) {
            return 0.0;
        }

        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}