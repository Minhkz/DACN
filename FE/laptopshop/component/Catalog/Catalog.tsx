"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Breadcrumb, Skeleton, Spin } from "antd";
import Link from "next/link";
import BrandFilter from "./Brand/BrandFilter";
import { LayoutGrid, List } from "lucide-react";
import FilterTag from "./FilterTag";
import ListView from "./ListView/ListView";
import GridView from "./GridView/GridView";
import { useQuery } from "@tanstack/react-query";
import { getProductPageByType } from "@/services/product/ProductApi";
import { ProductPageDto } from "@/types/product/ProductPageDto";

const DEFAULT_PAGE_DATA: ProductPageDto = {
  items: [],
  page: 0,
  size: 5,
  totalItems: 0,
  totalPages: 0,
  last: true,
};

const typeLabelMap: Record<string, string> = {
  laptop: "MSI Laptops",
  desktop: "MSI Desktops",
  monitor: "MSI Monitors",
  "custom-build": "Custom Builds",
};

const Catalog = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const type = searchParams.get("type") ?? "";
  const page = Number(searchParams.get("page") ?? "0");
  const size = Number(searchParams.get("size") ?? "5");
  const sort = searchParams.get("sort") ?? "";

  const [view, setView] = useState<"grid" | "list">("grid");

  const sortArray = useMemo(() => (sort ? sort.split(",") : undefined), [sort]);

  const { data = DEFAULT_PAGE_DATA, isLoading } = useQuery<ProductPageDto>({
    queryKey: ["products-by-type", type, page, size, sort],
    queryFn: () => getProductPageByType(type, page, size, sortArray),
  });

  const updateQueryParams = (
    updates: Record<string, string | number | null>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) =>
    updateQueryParams({ page: newPage });

  const handleSortChange = (value: string) =>
    updateQueryParams({ sort: value || null, page: 0 });

  const handleSizeChange = (value: string) =>
    updateQueryParams({ size: Number(value), page: 0 });

  return (
    <div className="container-global" style={{ paddingBottom: "40px" }}>
      {/* Banner */}
      <div style={{ marginBottom: "16px" }}>
        <Image
          src="/img/catalog_banner.png"
          alt="Catalog Banner"
          width={1398}
          height={104}
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      </div>

      {/* Breadcrumb */}
      <div style={{ marginBottom: "20px" }}>
        <Breadcrumb
          items={[
            { title: <Link href="/">Home</Link> },
            { title: typeLabelMap[type] || "MSI Products" },
          ]}
        />
      </div>

      {/* Main layout */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        {/* Sidebar */}
        <aside
          className="hidden lg:block"
          style={{ width: "200px", minWidth: "200px", flexShrink: 0 }}
        >
          <Link
            href="/"
            style={{
              display: "inline-block",
              fontSize: "13px",
              color: "var(--color-text-secondary, #888)",
              marginBottom: "12px",
              textDecoration: "none",
            }}
          >
            ‹ Back
          </Link>

          {/* Filter box */}
          <div>
            <BrandFilter />
          </div>
        </aside>

        {/* Right column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              padding: "10px 14px",
              border: "0.5px solid #e5e7eb",
              borderRadius: "8px",
              background: "white",
              marginBottom: "12px",
            }}
          >
            {/* Left: item count */}
            <span style={{ fontSize: "13px", color: "#6b7280" }}>
              {isLoading ? (
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 120, height: 16, borderRadius: 6 }}
                />
              ) : (
                `${data.totalItems} sản phẩm`
              )}
            </span>

            {/* Right: sort, size, view toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {/* Size */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                <span>Show:</span>
                <select
                  value={String(size)}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  style={{
                    fontSize: "13px",
                    border: "0.5px solid #d1d5db",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <option value="5">5 / page</option>
                  <option value="10">10 / page</option>
                  <option value="24">24 / page</option>
                  <option value="30">30 / page</option>
                </select>
              </div>

              {/* View toggle */}
              <div
                style={{
                  display: "flex",
                  border: "0.5px solid #e5e7eb",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  style={{
                    width: "32px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    background: view === "grid" ? "#E6F1FB" : "transparent",
                    color: view === "grid" ? "#185FA5" : "#9ca3af",
                    transition: "background 0.1s",
                  }}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  style={{
                    width: "32px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    borderLeft: "0.5px solid #e5e7eb",
                    cursor: "pointer",
                    background: view === "list" ? "#E6F1FB" : "transparent",
                    color: view === "list" ? "#185FA5" : "#9ca3af",
                    transition: "background 0.1s",
                  }}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter tags */}
          <div style={{ marginBottom: "16px" }}>
            <FilterTag />
          </div>

          {/* Product view */}
          {view === "grid" ? (
            <GridView
              products={data.items}
              loading={isLoading}
              pageData={data}
              onPageChange={handlePageChange}
            />
          ) : (
            <ListView
              products={data.items}
              loading={isLoading}
              pageData={data}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
