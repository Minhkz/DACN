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
    <section style={{ marginBottom: "36px" }}>
      {/* ===== SERIES TABS ===== */}
      {props.series && (
        <div
          className="
            flex overflow-x-auto whitespace-nowrap
            [-ms-overflow-style:none] [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
          style={{ marginBottom: "21px", gap: "24px" }}
        >
          {props.series.map((item, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                shrink-0 border-b-[3px] text-sm font-bold tracking-tight
                transition-all duration-300 cursor-pointer
                ${
                  activeIndex === index
                    ? "border-[#0156ff] text-[#0156ff] scale-[1.02]"
                    : "border-transparent text-slate-400 hover:border-slate-300 hover:text-slate-700"
                }
              `}
              style={{
                paddingBottom: "6px",
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
            overflow-hidden rounded-2xl xl:flex transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(1,86,255,0.18)]
          "
        >
          {/* RGB border */}
          <div
            className="
              absolute inset-[-45%]
              animate-[spin_5s_linear_infinite]
              bg-[conic-gradient(from_0deg,#ff004c,#00f0ff,#7cff00,#ff004c)]
            "
          />

          {/* Background image */}
          <div
            className="
              absolute inset-[2px] rounded-[14px]
              bg-cover bg-center bg-no-repeat
              transition-transform duration-500
              group-hover:scale-105
            "
            style={{
              backgroundImage: `url(${props.banner.src})`,
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-[2px] rounded-[14px] bg-black/30" />

          {/* Title */}
          <div
            className="
              relative z-10 flex h-full w-full items-center justify-center
              text-center text-xl font-bold leading-snug text-white
              drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tight
            "
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            {props.banner.title}
          </div>
        </div>

        {/* ===== PRODUCTS HORIZONTAL SCROLL ===== */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="flex h-[360px] items-center justify-center bg-slate-50/40 border border-slate-100/80 rounded-2xl">
              <Spin size="large" />
            </div>
          ) : products.length > 0 ? (
            <div
              className="
                flex overflow-x-auto overflow-y-hidden
                scroll-smooth
                [-ms-overflow-style:none] [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
              style={{
                paddingBottom: "10px",
                gap: "24px",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="shrink-0 transition-transform duration-300 hover:-translate-y-1"
                >
                  <CardProduct product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[360px] items-center justify-center bg-slate-50/40 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-sm font-semibold text-slate-400">
                Không có sản phẩm
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SeriesProduct;
