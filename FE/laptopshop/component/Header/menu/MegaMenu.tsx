"use client";

import React, { useEffect, useMemo, useState } from "react";
import { NavItem } from "@/types/header/menu/MenuType";
import CardProduct from "@/component/Product/CardProduct/CardProduct";
import Link from "next/link";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { useQuery } from "@tanstack/react-query";
import { getProductByType } from "@/services/product/ProductApi";
import { Spin } from "antd";
import Image from "next/image";
import Brand from "@/component/Brand/Brand";

type Props = {
  item: NavItem | null;
  open: boolean;
};

const MegaMenu = ({ item, open }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [item]);

  const activeChild = item?.children?.[activeIndex];

  const { data: products = [], isLoading: isProductsLoading } = useQuery<
    ProductDetailDto[]
  >({
    queryKey: ["products-by-type", activeChild?.slug],
    queryFn: () => getProductByType(activeChild?.slug as string),
    enabled: !!activeChild?.slug && open,
    staleTime: 1000 * 60 * 5,
  });

  const visibleProducts = products.slice(0, 4);

  if (!item || !item.children?.length) return null;

  return (
    <div
      className={`absolute left-0 w-full bg-white z-40 border-b border-slate-100 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.06)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
      style={{ top: "100%" }}
    >
      {/* Nâng lên max-w-7xl để tạo không gian rộng rãi cho các sản phẩm */}
      <div className="container-global mx-auto max-w-7xl">
        <div className="flex border-t border-slate-100/60">
          {/* Cột Danh mục bên trái */}
          <ul
            className="w-[240px] shrink-0 border-r border-slate-100 flex flex-col"
            style={{
              paddingRight: "20px",
              paddingTop: "20px",
              paddingBottom: "20px",
              gap: "4px",
            }}
          >
            {item.children.map((child, index) => (
              <li
                key={`${child.href}-${index}`}
                className={`rounded-xl transition-all duration-200 ${
                  index === activeIndex
                    ? "bg-blue-50/80 text-[#0156ff]"
                    : "text-slate-600 hover:bg-slate-50/60 hover:text-slate-800"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <Link
                  href={child.href}
                  className="block font-bold text-sm"
                  style={{ padding: "10px 16px" }}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Grid Sản phẩm bên phải (Đã tinh chỉnh co giãn với min/max width hợp lý) */}
          <div
            className="flex-1"
            style={{
              paddingLeft: "32px",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            {isProductsLoading ? (
              <div className="flex justify-center items-center h-[200px]">
                <Spin size="large" />
              </div>
            ) : visibleProducts.length > 0 ? (
              <div
                className="grid grid-cols-4 justify-items-center [&>div]:w-full [&>div]:max-w-[234px]"
                style={{ gap: "16px" }}
              >
                {visibleProducts.map((product) => (
                  <CardProduct key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col justify-center items-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 h-[220px]"
                style={{ padding: "48px 24px" }}
              >
                <p
                  className="text-slate-400 text-sm font-medium"
                  style={{ margin: 0 }}
                >
                  Không có sản phẩm
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Thương hiệu thương mại ở cuối Menu */}
        <div
          className="border-t border-slate-100/60"
          style={{ paddingTop: "16px", paddingBottom: "16px" }}
        >
          <Brand />
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
