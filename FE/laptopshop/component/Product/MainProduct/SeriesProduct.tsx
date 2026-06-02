"use client";

import React, { useState } from "react";
import CardProduct from "../CardProduct/CardProduct";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { getProductByType } from "@/services/product/ProductApi";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";

interface SeriesProductProps {
  banner: {
    src: string;
    title: string;
  };
  series?: string[];
  type: string;
}

const SeriesProduct = (props: SeriesProductProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: products = [], isLoading } = useQuery<ProductDetailDto[]>({
    queryKey: ["products-by-type", props.type],
    queryFn: () => getProductByType(props.type),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section style={{ marginBottom: 36 }}>
      {/* ===== SERIES TABS ===== */}
      {props.series && (
        <div
          className="
            flex gap-6 overflow-x-auto whitespace-nowrap
            [-ms-overflow-style:none] [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
          style={{ marginBottom: 21 }}
        >
          {props.series.map((item, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                shrink-0 border-b-2 text-sm font-semibold
                transition-all duration-200
                ${
                  activeIndex === index
                    ? "border-[#0156ff] text-[#0156ff]"
                    : "border-transparent text-gray-600 hover:border-[#0156ff] hover:text-[#0156ff]"
                }
              `}
              style={{
                paddingBottom: 4,
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex gap-6">
        {/* ===== BANNER ===== */}
        <div
          className="
            group relative hidden h-[360px] w-[233px] shrink-0 cursor-pointer
            overflow-hidden rounded-xl xl:flex
          "
        >
          {/* RGB border */}
          <div
            className="
              absolute inset-[-40%]
              animate-[spin_5s_linear_infinite]
              bg-[conic-gradient(from_0deg,#ff004c,#00f0ff,#7cff00,#ff004c)]
            "
          />

          {/* Background image */}
          <div
            className="
              absolute inset-[2px] rounded-[10px]
              bg-cover bg-center bg-no-repeat
              transition-transform duration-500
              group-hover:scale-105
            "
            style={{
              backgroundImage: `url(${props.banner.src})`,
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-[2px] rounded-[10px] bg-black/25" />

          {/* Title */}
          <div
            className="
              relative z-10 flex h-full w-full items-center justify-center
              text-center text-xl font-semibold leading-[1.4] text-white
              drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]
            "
            style={{
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {props.banner.title}
          </div>
        </div>

        {/* ===== PRODUCTS HORIZONTAL SCROLL ===== */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="flex h-[360px] items-center justify-center">
              <Spin size="large" />
            </div>
          ) : products.length > 0 ? (
            <div
              className="
                flex gap-6 overflow-x-auto overflow-y-hidden
                scroll-smooth
                [-ms-overflow-style:none] [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
              style={{
                paddingBottom: 10,
              }}
            >
              {products.map((product) => (
                <div key={product.id} className="shrink-0">
                  <CardProduct product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[360px] items-center justify-center">
              <p className="text-sm text-gray-500">Không có sản phẩm</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SeriesProduct;
