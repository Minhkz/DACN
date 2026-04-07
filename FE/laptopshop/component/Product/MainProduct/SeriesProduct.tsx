"use client";

import ProductType from "@/types/product/ProductType";
import React, { useState } from "react";
import CardProduct from "../CardProduct/CardProduct";
import styles from "./SeriesProduct.module.css";

interface SeriesProductProps {
  banner: {
    src: string;
    title: string;
  };
  product: ProductType;
  series?: string[];
}

const SeriesProduct = (props: SeriesProductProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

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
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
        </div>
      </div>
    </section>
  );
};

export default SeriesProduct;
