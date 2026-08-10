"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import CardProduct from "../CardProduct/CardProduct";
import { Carousel, Skeleton } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import Dialog from "@/component/Modal/Dialog";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { getNewProducts } from "@/services/product/ProductApi";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";

const NewProduct = () => {
  const [openAll, setOpenAll] = useState<boolean>(false);
  const carouselRef = useRef<CarouselRef | null>(null);

  const { data: products = [], isLoading } = useQuery<ProductDetailDto[]>({
    queryKey: ["new-products"],
    queryFn: () => getNewProducts(12),
    staleTime: 1000 * 60 * 5,
  });

  const skeletonItems = Array.from({ length: 5 });

  return (
    <section
      className="container-global mx-auto max-w-7xl"
      style={{
        marginTop: "28px",
        marginBottom: "28px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      {/* ─── SECTION HEADER ──────────────────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
        style={{
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid #e2e8f0",
          margin: "0 0 16px 0",
        }}
      >
        <div style={{ margin: "0", padding: "0" }}>
          <h2
            className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
            style={{ margin: "0 0 2px 0", padding: "0" }}
          >
            Sản phẩm mới về
          </h2>
          <p
            className="text-xs text-slate-500 font-normal"
            style={{ margin: "0", padding: "0" }}
          >
            Cập nhật các mẫu laptop gaming, văn phòng và linh kiện mới nhất
          </p>
        </div>

        {/* Carousel controls & View all */}
        <div
          className="flex items-center gap-2 self-end sm:self-auto"
          style={{ margin: "0", padding: "0" }}
        >
          <div className="flex items-center gap-1" style={{ margin: "0", padding: "0" }}>
            <button
              type="button"
              onClick={() => carouselRef.current?.prev()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Previous products"
              style={{ margin: "0", padding: "0" }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => carouselRef.current?.next()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Next products"
              style={{ margin: "0", padding: "0" }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpenAll(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0156ff] hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            style={{
              padding: "6px 12px",
              marginLeft: "4px",
              margin: "0 0 0 4px",
            }}
          >
            <span>Xem tất cả ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── PRODUCT CAROUSEL / SKELETON ────────────────────────────────────────── */}
      {isLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5"
          style={{ margin: "0", padding: "0" }}
        >
          {skeletonItems.map((_, index) => (
            <div
              key={`new-prod-skel-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-3 flex flex-col justify-between"
              style={{
                height: "350px",
                padding: "14px",
                margin: "0",
              }}
            >
              <Skeleton.Image
                active
                style={{
                  width: "100%",
                  height: 140,
                  borderRadius: 8,
                }}
              />

              <div style={{ marginTop: "12px", margin: "12px 0 0 0", padding: "0" }}>
                <Skeleton
                  active
                  paragraph={{
                    rows: 2,
                    width: ["100%", "65%"],
                  }}
                  title={{
                    width: "80%",
                  }}
                />
              </div>

              <div
                className="w-full h-8 bg-slate-100 rounded-lg mt-auto"
                style={{ margin: "auto 0 0 0", padding: "0" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="relative"
          style={{ margin: "0 -6px", padding: "2px 0" }}
        >
          <Carousel
            ref={carouselRef}
            infinite
            autoplay
            autoplaySpeed={4000}
            draggable
            dots={false}
            slidesToShow={5}
            slidesToScroll={1}
            responsive={[
              { breakpoint: 1280, settings: { slidesToShow: 4 } },
              { breakpoint: 1024, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 480, settings: { slidesToShow: 1 } },
            ]}
          >
            {products.map((product) => (
              <div
                key={`new-product-${product.id}`}
                style={{
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  margin: "0",
                }}
              >
                <CardProduct product={product} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* ─── POLICY / INSTALLMENT BANNER ────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200"
        style={{
          marginTop: "20px",
          paddingLeft: "18px",
          paddingRight: "18px",
          paddingTop: "12px",
          paddingBottom: "12px",
          margin: "20px 0 0 0",
        }}
      >
        <div
          className="flex items-center gap-3 text-slate-700"
          style={{ margin: "0", padding: "0" }}
        >
          <CreditCard className="w-5 h-5 text-[#0156ff] shrink-0" />
          <p
            className="text-xs sm:text-sm font-medium text-slate-800"
            style={{ margin: "0", padding: "0" }}
          >
            <strong>Hỗ trợ trả góp 0% lãi suất</strong> qua thẻ tín dụng và công ty tài chính • Bảo hành 24 tháng chính hãng
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenAll(true)}
          className="text-xs font-semibold text-[#0156ff] hover:underline cursor-pointer shrink-0"
          style={{ margin: "0", padding: "0", border: "none", background: "transparent" }}
        >
          Xem chi tiết →
        </button>
      </div>

      {/* Modal Dialog */}
      <Dialog
        open={openAll}
        onClose={() => setOpenAll(false)}
        content={products}
        isLoading={isLoading}
      />
    </section>
  );
};

export default React.memo(NewProduct);
