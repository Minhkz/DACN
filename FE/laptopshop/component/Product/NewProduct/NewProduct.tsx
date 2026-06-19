"use client";

import Image from "next/image";
import CardProduct from "../CardProduct/CardProduct";
import { Carousel, Skeleton } from "antd";
import { useState } from "react";
import Dialog from "@/component/Modal/Dialog";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { getNewProducts } from "@/services/product/ProductApi";
import { useQuery } from "@tanstack/react-query";

const NewProduct = () => {
  const [openAll, setOpenAll] = useState<boolean>(false);

  const { data: products = [], isLoading } = useQuery<ProductDetailDto[]>({
    queryKey: ["new-products"],
    queryFn: () => getNewProducts(7),
  });

  const skeletonItems = Array.from({ length: 6 });

  return (
    <section className="container-global mx-auto max-w-7xl">
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: "24px",
          marginBottom: "16px",
        }}
      >
        <h2
          className="text-2xl font-extrabold text-slate-900 tracking-tight"
          style={{ margin: 0 }}
        >
          Sản phẩm mới
        </h2>

        <button
          type="button"
          onClick={() => setOpenAll(true)}
          className="
            text-xs font-bold text-[#0156FF]
            border border-blue-100 bg-blue-50/50 hover:bg-blue-50
            transition-all duration-300 rounded-xl cursor-pointer
          "
          style={{ padding: "8px 16px" }}
        >
          Xem tất cả
        </button>
      </div>

      {/* Product list */}
      {isLoading ? (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(6, 1fr)",
          }}
        >
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-100 bg-white shadow-sm animate-pulse"
              style={{
                padding: "16px",
              }}
            >
              <Skeleton.Image
                active
                style={{
                  width: "100%",
                  height: 150,
                  borderRadius: 12,
                }}
              />

              <div style={{ marginTop: "12px" }}>
                <Skeleton
                  active
                  paragraph={{
                    rows: 2,
                    width: ["100%", "70%"],
                  }}
                  title={{
                    width: "85%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <Carousel
            infinite
            autoplay
            autoplaySpeed={2500}
            draggable
            dots={false}
            slidesToShow={6}
            slidesToScroll={1}
            responsive={[
              { breakpoint: 1280, settings: { slidesToShow: 5 } },
              { breakpoint: 1024, settings: { slidesToShow: 4 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 480, settings: { slidesToShow: 1 } },
            ]}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
              >
                <CardProduct product={product} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* Zip banner */}
      <div
        className="
          flex items-center justify-center gap-4
          rounded-2xl bg-slate-50/80 border border-slate-100/50
        "
        style={{
          minHeight: "72px",
          marginTop: "20px",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      >
        <div className="shrink-0">
          <Image src="/img/zip.png" alt="zip" width={77} height={27} />
        </div>

        <Image
          src="/img/Vector.png"
          alt="divider"
          width={2}
          height={23}
          className="shrink-0"
        />

        <div className="text-base font-semibold text-slate-800 tracking-tight flex items-center flex-wrap justify-center">
          Sở hữu ngay hôm nay, trả góp không lãi suất lên đến 6 tháng.
          <span
            className="
              cursor-pointer underline text-[#0156FF] hover:text-[#004ee6] transition-colors
            "
            onClick={() => setOpenAll(true)}
            style={{
              marginLeft: "6px",
            }}
          >
            Tìm hiểu thêm
          </span>
        </div>
      </div>

      <Dialog
        open={openAll}
        onClose={() => setOpenAll(false)}
        content={products}
        isLoading={isLoading}
      />
    </section>
  );
};

export default NewProduct;
