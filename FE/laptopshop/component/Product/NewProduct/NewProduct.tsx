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
    <section className="container-global">
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: 24,
          marginBottom: 14,
        }}
      >
        <h2 className="text-[22px] font-bold text-black">Sản phẩm mới</h2>

        <button
          type="button"
          onClick={() => setOpenAll(true)}
          className="
            text-[13px] font-normal text-[#0156FF]
            transition-all duration-200
            hover:underline hover:opacity-80
          "
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
              className="rounded-2xl border border-gray-100 bg-white"
              style={{
                padding: 14,
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

              <div style={{ marginTop: 12 }}>
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
                  paddingLeft: 4,
                  paddingRight: 4,
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
          rounded-xl bg-[#F5F7FF]
        "
        style={{
          height: 70,
          marginTop: 12,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 12,
          paddingBottom: 12,
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

        <div className="text-[18px] font-normal text-[#272560]">
          Sở hữu ngay hôm nay, trả góp không lãi suất lên đến 6 tháng.
          <span
            className="
              cursor-pointer underline transition-opacity duration-200
              hover:opacity-75
            "
            style={{
              marginLeft: 4,
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
