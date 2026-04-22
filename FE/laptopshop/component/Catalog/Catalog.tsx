"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Breadcrumb, Skeleton } from "antd";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import ListView from "./ListView/ListView";
import GridView from "./GridView/GridView";
import ProductFilter from "./ProductFilter";

import { ProductPageDto } from "@/types/product/ProductPageDto";
import { ProductFilterValue } from "@/types/catalog/FilterDto";
import {
  buildProductFilterRequest,
  filterProducts,
  getProductPageByType,
} from "@/services/product/ProductApi";

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

const typeIdMap: Record<string, number> = {
  laptop: 4,
  desktop: 5,
  monitor: 6,
  "custom-build": 3,
};

const hasAppliedFilters = (value: ProductFilterValue) => {
  const hasSelected = Object.values(value.selected).some(
    (ids) => ids.length > 0,
  );
  const hasMinPrice = value.minPrice !== undefined;
  const hasMaxPrice = value.maxPrice !== undefined;
  const hasSort = value.sortOrder !== null;

  return hasSelected || hasMinPrice || hasMaxPrice || hasSort;
};

const Catalog = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const type = searchParams.get("type") ?? "";
  const page = Number(searchParams.get("page") ?? "0");
  const size = Number(searchParams.get("size") ?? "5");

  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterValue, setFilterValue] = useState<ProductFilterValue>({
    selected: {},
    minPrice: undefined,
    maxPrice: undefined,
    sortOrder: null,
  });

  const isFiltering = useMemo(
    () => hasAppliedFilters(filterValue),
    [filterValue],
  );

  const forcedFilters = useMemo((): Record<string, number[]> => {
    const typeId = typeIdMap[type];
    if (!typeId) return {};
    return { type: [typeId] };
  }, [type]);

  const payload = useMemo(() => {
    return buildProductFilterRequest(filterValue, page, size, forcedFilters);
  }, [filterValue, page, size, forcedFilters]);

  const {
    data = DEFAULT_PAGE_DATA,
    isLoading,
    isFetching,
  } = useQuery<ProductPageDto>({
    queryKey: ["catalog-products", type, page, size, filterValue, isFiltering],
    queryFn: async () => {
      if (!isFiltering) {
        return getProductPageByType(type, page, size);
      }

      return filterProducts(payload);
    },
  });

  const updateQueryParams = (
    updates: Record<string, string | number | null>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
  };

  const handleSizeChange = (value: string) => {
    updateQueryParams({ size: Number(value), page: 0 });
  };

  const handleFilterChange = (value: ProductFilterValue) => {
    setFilterValue(value);
    updateQueryParams({ page: 0 });
  };

  const loading = isLoading || isFetching;

  return (
    <div className="container-global" style={{ paddingBottom: "40px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Image
          src="/img/catalog_banner.png"
          alt="Catalog Banner"
          width={1398}
          height={104}
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Breadcrumb
          items={[
            { title: <Link href="/">Home</Link> },
            { title: typeLabelMap[type] || "MSI Products" },
          ]}
        />
      </div>

      <div className="flex justify-between" style={{ gap: "20px" }}>
        <aside
          className="hidden lg:block shrink-0"
          style={{ width: "220px", minWidth: "220px" }}
        >
          <ProductFilter onChange={handleFilterChange} />
        </aside>

        <div className="flex-1 min-w-0">
          <div
            className="flex items-center justify-between flex-wrap rounded-lg bg-white border border-gray-200"
            style={{ gap: "10px", padding: "10px 16px", marginBottom: "16px" }}
          >
            <span className="text-sm text-gray-500">
              {loading ? (
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 120, height: 16, borderRadius: 6 }}
                />
              ) : (
                `${data.totalItems} sản phẩm`
              )}
            </span>

            <div className="flex items-center" style={{ gap: "10px" }}>
              <div
                className="flex items-center text-sm text-gray-500"
                style={{ gap: "6px" }}
              >
                <span>Show:</span>
                <select
                  value={String(size)}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md bg-white cursor-pointer"
                  style={{ padding: "4px 8px" }}
                >
                  <option value="5">5 / page</option>
                  <option value="10">10 / page</option>
                  <option value="24">24 / page</option>
                  <option value="30">30 / page</option>
                </select>
              </div>

              <div className="flex border border-gray-200 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`w-8 h-[30px] flex items-center justify-center cursor-pointer transition-colors duration-100 border-none ${
                    view === "grid"
                      ? "bg-[#E6F1FB] text-[#185FA5]"
                      : "bg-transparent text-gray-400"
                  }`}
                >
                  <LayoutGrid size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`w-8 h-[30px] flex items-center justify-center cursor-pointer transition-colors duration-100 border-none border-l border-gray-200 ${
                    view === "list"
                      ? "bg-[#E6F1FB] text-[#185FA5]"
                      : "bg-transparent text-gray-400"
                  }`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {view === "grid" ? (
            <GridView
              products={data.items}
              loading={loading}
              pageData={data}
              onPageChange={handlePageChange}
            />
          ) : (
            <ListView
              products={data.items}
              loading={loading}
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
