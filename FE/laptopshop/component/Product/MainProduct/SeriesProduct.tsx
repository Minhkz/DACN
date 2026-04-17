"use client";

import React, { useState } from "react";
import CardProduct from "../CardProduct/CardProduct";
import styles from "./SeriesProduct.module.css";
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
    <section className="mb-12 " style={{ marginBottom: "36px" }}>
      {/* ===== SERIES TABS ===== */}
      {props.series && (
        <div
          className="flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide"
          style={{ marginBottom: "21px" }}
        >
          {props.series.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                text-sm
                font-semibold
                cursor-pointer
                pb-1
                shrink-0
                transition
                ${
                  activeIndex === index
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600"
                }
              `}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex gap-6">
        {/* Banner (desktop only) */}
        <div
          className={`
            hidden xl:flex
            w-[233px] h-[360px]
            items-center justify-center
            p-4 text-white font-semibold shrink-0
            ${styles.gamingBorder}
          `}
          style={{
            ["--banner-bg" as any]: `url(${props.banner.src})`,
          }}
        >
          <span className={styles.bannerTitle}>{props.banner.title}</span>
        </div>

        {/* Products */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-4 flex justify-center items-center h-[200px]">
              <Spin size="large" />
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <CardProduct key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-4 flex justify-center items-center h-[200px]">
              <p className="text-gray-500">Không có sản phẩm</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SeriesProduct;
