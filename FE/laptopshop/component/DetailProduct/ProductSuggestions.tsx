"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { recommendationApi } from "@/services/recommendation/RecommendationApi";
import { detail } from "@/services/product/ProductApi";

interface SuggestionProduct {
  id: number;
  name: string;
  price: number;
  avatar: string;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

type ProductSuggestionsProps = {
  currentId: number;
  onSelectProduct: (id: number) => void;
};

export default function ProductSuggestions({
  currentId,
  onSelectProduct,
}: ProductSuggestionsProps) {
  const { data: suggestions, isLoading } = useQuery<SuggestionProduct[]>({
    queryKey: ["product-suggestions", currentId],
    queryFn: async () => {
      const res = await recommendationApi.getRecommendations(currentId);
      const { similarProducts, frequentlyBoughtTogether } = res.data;

      // Gộp 2 track, ưu tiên similarProducts trước, loại trùng nếu có
      const mergedIds = Array.from(
        new Set([...similarProducts, ...frequentlyBoughtTogether]),
      );

      if (mergedIds.length === 0) return [];

      // Gọi song song API chi tiết cho từng id
      const products = await Promise.all(
        mergedIds.map(async (id) => {
          const i = await detail(id);
          return {
            id: i.id,
            name: i.name,
            price: i.price,
            avatar: i.avatar,
          } as SuggestionProduct;
        }),
      );

      return products;
    },
    enabled: !!currentId,
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút
  });

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ padding: "24px 0" }}
      >
        <Spin size="small" />
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div
      className="border border-slate-100 bg-slate-50/50 rounded-2xl animate-fade-in"
      style={{ padding: "16px", marginTop: "20px", marginBottom: "16px" }}
    >
      <h3
        className="text-xs font-bold text-slate-800 flex items-center gap-2"
        style={{ marginBottom: "12px", marginTop: 0 }}
      >
        <span className="w-1.5 h-4 rounded-full bg-[#0156ff]"></span>
        Sản phẩm liên quan
      </h3>
      <div className="flex flex-col" style={{ gap: "8px" }}>
        {suggestions.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectProduct(item.id)}
            className="flex items-center bg-white border border-slate-100 rounded-xl cursor-pointer shadow-sm hover:border-[#0156ff]/40 hover:shadow-md transition-all duration-300 group"
            style={{ padding: "8px", gap: "12px" }}
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100/50">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0156ff] transition-colors duration-200">
                {item.name}
              </h4>
              <p
                className="text-sm font-extrabold text-[#0156ff]"
                style={{ marginTop: "4px", marginBottom: 0 }}
              >
                {formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
