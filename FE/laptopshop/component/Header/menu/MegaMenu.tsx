"use client";

import React, { useEffect, useState } from "react";
import { NavItem } from "@/types/header/menu/MenuType";
import Link from "next/link";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { useQuery } from "@tanstack/react-query";
import { getProductByType } from "@/services/product/ProductApi";
import { Spin } from "antd";
import Image from "next/image";
import { ChevronRight, ArrowRight, PackageOpen, Sparkles } from "lucide-react";

type Props = {
  item: NavItem | null;
  open: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
};

const brandLogos = [
  { src: "/logo/roccat.png", alt: "Roccat" },
  { src: "/logo/msi.png", alt: "MSI" },
  { src: "/logo/razer.png", alt: "Razer" },
  { src: "/logo/thermaltake.png", alt: "Thermaltake" },
  { src: "/logo/adata.png", alt: "ADATA" },
  { src: "/logo/hp.png", alt: "HP" },
  { src: "/logo/gigabyte.png", alt: "Gigabyte" },
];

const MegaMenu = ({
  item,
  open,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [item]);

  const activeChild = item?.children?.[activeIndex];

  const { data: products = [], isLoading: isProductsLoading } = useQuery<
    ProductDetailDto[]
  >({
    queryKey: ["products-by-type", activeChild?.slug],
    queryFn: () => getProductByType(activeChild?.slug as string, 8),
    enabled: !!activeChild?.slug && open,
    staleTime: 1000 * 60 * 5,
  });

  const visibleProducts = products.slice(0, 4);

  if (!item || !item.children?.length) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 right-0 w-full flex justify-center z-40 transition-all duration-200 ease-out ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
      style={{
        top: "100%",
        paddingTop: "6px",
        margin: "0",
      }}
    >
      {/* Invisible hover bridge connecting navbar to MegaMenu */}
      <div
        className="absolute -top-3 left-0 right-0 h-4 bg-transparent pointer-events-auto"
        style={{ margin: "0", padding: "0" }}
      />

      {/* Balanced Floating Panel with Harmonious Width & Height Proportions (880px x ~290px) */}
      <div
        className="w-full max-w-[880px] bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] overflow-hidden"
        style={{
          padding: "16px 20px 14px 20px",
          margin: "0 auto",
        }}
      >
        <div
          className="flex items-stretch"
          style={{ margin: "0", padding: "0" }}
        >
          {/* Left Category Column (Balanced 195px width) */}
          <div
            className="w-[195px] shrink-0 border-r border-slate-100 flex flex-col justify-between"
            style={{
              paddingRight: "14px",
              margin: "0",
            }}
          >
            <div>
              <div
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400"
                style={{
                  paddingLeft: "6px",
                  paddingBottom: "8px",
                  margin: "0",
                }}
              >
                <Sparkles className="w-3 h-3 text-[#0156ff]" />
                <span>Danh mục MSI</span>
              </div>

              <ul
                className="flex flex-col"
                style={{
                  gap: "3px",
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                }}
              >
                {item.children.map((child, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={`mega-cat-${child.label}-${child.href}-${index}`}
                      style={{ margin: "0", padding: "0" }}
                    >
                      <Link
                        href={child.href}
                        onClick={onClose}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full flex items-center justify-between text-left rounded-lg font-semibold text-xs transition-all duration-150 cursor-pointer ${
                          isActive
                            ? "bg-blue-50/90 text-[#0156ff] shadow-xs translate-x-0.5"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                        style={{
                          padding: "8px 10px",
                          margin: "0",
                          border: "none",
                          textDecoration: "none",
                        }}
                      >
                        <span className="truncate">{child.label}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-150 shrink-0 ${
                            isActive
                              ? "text-[#0156ff] translate-x-0.5"
                              : "text-slate-300 opacity-60"
                          }`}
                          style={{ margin: "0", padding: "0" }}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* View All link for category */}
            {activeChild && (
              <div
                style={{
                  paddingTop: "8px",
                  paddingLeft: "6px",
                  margin: "0",
                }}
              >
                <Link
                  href={activeChild.href}
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0156ff] hover:text-blue-700 transition-colors group"
                  style={{ margin: "0", padding: "0" }}
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Product Showcase Grid (Harmonious Square-like Cards) */}
          <div
            className="flex-1 flex flex-col justify-between"
            style={{
              paddingLeft: "16px",
              margin: "0",
            }}
          >
            <div>
              <div
                className="flex items-center justify-between"
                style={{
                  paddingBottom: "8px",
                  margin: "0",
                }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ margin: "0", padding: "0" }}
                >
                  <span
                    className="font-bold text-slate-800 text-xs"
                    style={{ margin: "0", padding: "0" }}
                  >
                    {activeChild?.label || "Sản phẩm nổi bật"}
                  </span>
                  <span
                    className="text-[10px] bg-slate-100 text-slate-500 font-semibold rounded-full"
                    style={{
                      padding: "1px 6px",
                      margin: "0",
                    }}
                  >
                    {products.length} SP
                  </span>
                </div>

                {activeChild && (
                  <Link
                    href={activeChild.href}
                    onClick={onClose}
                    className="text-[11px] font-medium text-slate-500 hover:text-[#0156ff] transition-colors"
                    style={{ margin: "0", padding: "0" }}
                  >
                    Xem thêm →
                  </Link>
                )}
              </div>

              {isProductsLoading ? (
                <div
                  className="flex flex-col justify-center items-center h-[155px] rounded-xl bg-slate-50/50"
                  style={{ margin: "0", padding: "16px" }}
                >
                  <Spin size="small" />
                  <p
                    className="text-[11px] text-slate-400 font-medium"
                    style={{
                      marginTop: "6px",
                      margin: "6px 0 0 0",
                      padding: "0",
                    }}
                  >
                    Đang tải sản phẩm...
                  </p>
                </div>
              ) : visibleProducts.length > 0 ? (
                <div
                  className="grid grid-cols-4 gap-2.5"
                  style={{
                    margin: "0",
                    padding: "0",
                  }}
                >
                  {visibleProducts.map((product, pIdx) => (
                    <Link
                      key={`mega-prod-${product.id}-${pIdx}`}
                      href={`/categories?type=${activeChild?.slug || "laptop"}`}
                      onClick={onClose}
                      className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-blue-200/80 rounded-xl transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 overflow-hidden"
                      style={{
                        padding: "8px",
                        margin: "0",
                        textDecoration: "none",
                        minHeight: "155px",
                      }}
                    >
                      {/* Product Thumbnail */}
                      <div
                        className="relative w-full h-[76px] flex items-center justify-center rounded-lg bg-white overflow-hidden border border-slate-50"
                        style={{ margin: "0 0 6px 0", padding: "3px" }}
                      >
                        <Image
                          src={product.avatar || "/product/msi-pro16.png"}
                          alt={product.name}
                          fill
                          className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Title */}
                      <p
                        className="text-[11.5px] font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#0156ff] transition-colors"
                        style={{ margin: "0 0 4px 0", padding: "0" }}
                      >
                        {product.name}
                      </p>

                      {/* Price & Status */}
                      <div
                        className="flex items-center justify-between"
                        style={{
                          marginTop: "auto",
                          paddingTop: "4px",
                          margin: "auto 0 0 0",
                        }}
                      >
                        <span
                          className="text-[11.5px] font-bold text-[#0156ff]"
                          style={{ margin: "0", padding: "0" }}
                        >
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </span>
                        <span
                          className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 rounded"
                          style={{ padding: "1px 4px", margin: "0" }}
                        >
                          Sẵn
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div
                  className="flex flex-col justify-center items-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200/80 h-[155px]"
                  style={{
                    padding: "16px",
                    margin: "0",
                  }}
                >
                  <PackageOpen
                    className="w-7 h-7 text-slate-300"
                    style={{ marginBottom: "4px" }}
                  />
                  <p
                    className="text-slate-500 text-xs font-semibold"
                    style={{ margin: "0 0 2px 0", padding: "0" }}
                  >
                    Chưa có sản phẩm
                  </p>
                  <p
                    className="text-slate-400 text-[10.5px]"
                    style={{ margin: "0", padding: "0" }}
                  >
                    Vui lòng chọn danh mục khác
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Partner Brands Row (Proportional & Subtle) */}
        <div
          className="border-t border-slate-100 flex items-center justify-between"
          style={{
            marginTop: "12px",
            paddingTop: "10px",
            margin: "12px 0 0 0",
          }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0"
            style={{ margin: "0", padding: "0" }}
          >
            Đối tác chính hãng:
          </span>

          <div
            className="flex items-center gap-3.5 flex-wrap"
            style={{ margin: "0", padding: "0" }}
          >
            {brandLogos.map((brand, idx) => (
              <div
                key={`brand-compact-${brand.alt}-${idx}`}
                onClick={onClose}
                className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  padding: "1px 6px",
                  margin: "0",
                }}
              >
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={54}
                  height={18}
                  className="h-4.5 w-auto object-contain filter grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
