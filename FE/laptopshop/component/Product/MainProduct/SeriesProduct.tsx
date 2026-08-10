"use client";

import React, { useMemo, useRef, useState } from "react";
import CardProduct from "../CardProduct/CardProduct";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { getProductByType } from "@/services/product/ProductApi";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, PackageOpen } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Call API with size 12 to fetch full product list instead of defaulting to 4
  const { data: products = [], isLoading } = useQuery<ProductDetailDto[]>({
    queryKey: ["products-by-type", props.type],
    queryFn: () => getProductByType(props.type, 12),
    staleTime: 1000 * 60 * 5,
  });

  const activeSeriesName = props.series?.[activeIndex];

  // Filter products by selected series tab keyword, fallback to all category products if no matches
  const displayProducts = useMemo(() => {
    if (!props.series || props.series.length === 0 || !activeSeriesName) {
      return products;
    }
    const keyword = activeSeriesName
      .replace(/MSI/gi, "")
      .replace(/Series/gi, "")
      .trim()
      .toLowerCase();

    if (!keyword) return products;

    const matched = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(keyword) ||
        p.description?.toLowerCase().includes(keyword),
    );

    return matched.length > 0 ? matched : products;
  }, [products, props.series, activeSeriesName]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <section
      style={{
        marginBottom: "32px",
        margin: "0 0 32px 0",
        padding: "0",
      }}
    >
      {/* ─── SERIES TABS ────────────────────────────────────────────────────────── */}
      {props.series && props.series.length > 0 && (
        <div
          className="flex items-center gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            marginBottom: "14px",
            paddingBottom: "2px",
            margin: "0 0 14px 0",
          }}
        >
          {props.series.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                type="button"
                key={`series-tab-${item}-${index}`}
                onClick={() => setActiveIndex(index)}
                className={`text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#0156ff] text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
                style={{
                  padding: "6px 14px",
                  margin: "0",
                  border: "none",
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}

      {/* ─── MAIN CONTENT: CATEGORY BANNER + PRODUCT TRACK ─────────────────────── */}
      <div
        className="flex flex-col lg:flex-row gap-4 items-stretch"
        style={{ margin: "0", padding: "0" }}
      >
        {/* Category Banner Card */}
        <div
          className="group relative w-full lg:w-[230px] shrink-0 min-h-[200px] lg:min-h-[355px] rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between"
          style={{
            margin: "0",
            padding: "18px",
          }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-103"
            style={{
              backgroundImage: `url(${props.banner.src})`,
              margin: "0",
              padding: "0",
            }}
          />

          {/* Dark overlay for readability */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-slate-950/30"
            style={{ margin: "0", padding: "0" }}
          />

          {/* Top Label */}
          <div
            className="relative z-10 inline-flex items-center self-start text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-xs border border-white/20 rounded-md"
            style={{ padding: "3px 8px", margin: "0" }}
          >
            Chính hãng
          </div>

          {/* Title and View Category link */}
          <div className="relative z-10" style={{ margin: "0", padding: "0" }}>
            <h3
              className="text-lg lg:text-xl font-bold text-white tracking-tight leading-tight"
              style={{ margin: "0 0 6px 0", padding: "0" }}
            >
              {props.banner.title}
            </h3>

            <p
              className="text-[11.5px] text-slate-300 font-normal line-clamp-2"
              style={{ margin: "0 0 12px 0", padding: "0" }}
            >
              Xem cấu hình chi tiết và các chương trình ưu đãi kèm theo.
            </p>

            <Link
              href={`/categories?type=${props.type}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors"
              style={{
                padding: "7px 12px",
                margin: "0",
                textDecoration: "none",
              }}
            >
              <span>Xem tất cả ({displayProducts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Scrollable Product Track */}
        <div
          className="relative min-w-0 flex-1 flex flex-col justify-center"
          style={{ margin: "0", padding: "0" }}
        >
          {isLoading ? (
            <div
              className="flex h-[355px] items-center justify-center bg-slate-50/50 border border-slate-200 rounded-2xl"
              style={{ margin: "0", padding: "20px" }}
            >
              <Spin size="medium" />
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="relative group/track" style={{ margin: "0", padding: "0" }}>
              {/* Left Scroll Arrow */}
              <button
                type="button"
                onClick={scrollLeft}
                aria-label="Cuộn sang trái"
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white hover:bg-slate-50 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-opacity duration-150 cursor-pointer"
                style={{ margin: "0", padding: "0" }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Right Scroll Arrow */}
              <button
                type="button"
                onClick={scrollRight}
                aria-label="Cuộn sang phải"
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white hover:bg-slate-50 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-opacity duration-150 cursor-pointer"
                style={{ margin: "0", padding: "0" }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Horizontal Scroll Track */}
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto overflow-y-hidden scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{
                  gap: "14px",
                  paddingBottom: "6px",
                  paddingTop: "2px",
                  margin: "0",
                }}
              >
                {displayProducts.map((product) => (
                  <div
                    key={`series-prod-${product.id}`}
                    className="shrink-0 w-[235px]"
                    style={{ margin: "0", padding: "0" }}
                  >
                    <CardProduct product={product} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center h-[355px] bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-center"
              style={{ margin: "0", padding: "20px" }}
            >
              <PackageOpen className="w-8 h-8 text-slate-300" style={{ marginBottom: "6px" }} />
              <p
                className="text-xs font-semibold text-slate-500"
                style={{ margin: "0 0 2px 0", padding: "0" }}
              >
                Chưa có sản phẩm trong danh mục này
              </p>
              <p
                className="text-[11px] text-slate-400"
                style={{ margin: "0", padding: "0" }}
              >
                Vui lòng quay lại sau
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(SeriesProduct);
