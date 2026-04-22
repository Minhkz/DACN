"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import styles from "./ProductFilter.module.css";
import {
  FilterDto,
  ProductFilterValue,
  SelectedFilters,
} from "@/types/catalog/FilterDto";
import { FilterApi } from "@/services/category/FilterApi";
import ChipSkeleton from "./Skeleton/ChipSkeleton";

const LABEL_MAP: Record<string, string> = {
  type: "Loại sản phẩm",
  brand: "Thương hiệu",
  processor: "Bộ vi xử lý",
  storage: "Bộ nhớ",
  panel: "Loại màn hình",
};

const BRAND_LOGOS: Record<string, string> = {
  roccat: "/logo/roccat.png",
  msi: "/logo/msi.png",
  razer: "/logo/razer.png",
  thermaltake: "/logo/thermaltake.png",
  adata: "/logo/adata.png",
  hp: "/logo/hp.png",
  gigabyte: "/logo/gigabyte.png",
};

function getLabel(type: string): string {
  return LABEL_MAP[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

type SortOrder = "asc" | "desc" | null;

type ProductFilterProps = {
  onChange?: (value: ProductFilterValue) => void;
};

export default function ProductFilter({ onChange }: ProductFilterProps) {
  const [selected, setSelected] = useState<SelectedFilters>({});
  const [draftSelected, setDraftSelected] = useState<SelectedFilters>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");

  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [draftSortOrder, setDraftSortOrder] = useState<SortOrder>(null);

  const { data: filters = [], isLoading } = useQuery<FilterDto[]>({
    queryKey: ["filters"],
    queryFn: FilterApi.getAll,
  });

  const groups = useMemo(() => {
    const map = new Map<string, FilterDto[]>();

    for (const f of filters) {
      if (!map.has(f.type)) {
        map.set(f.type, []);
      }
      map.get(f.type)!.push(f);
    }

    return Array.from(map.entries());
  }, [filters]);

  const toggle = (type: string, id: number) => {
    setDraftSelected((prev) => {
      const current = prev[type] ?? [];
      const nextValues = current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id];

      const next: SelectedFilters = {
        ...prev,
        [type]: nextValues,
      };

      if (nextValues.length === 0) {
        delete next[type];
      }

      return next;
    });
  };

  const toggleCollapse = (type: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const clearAll = () => {
    setSelected({});
    setDraftSelected({});
    setMinPrice("");
    setMaxPrice("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setSortOrder(null);
    setDraftSortOrder(null);

    onChange?.({
      selected: {},
      minPrice: undefined,
      maxPrice: undefined,
      sortOrder: null,
    });
  };

  const applyFilters = () => {
    const parsedMin =
      draftMinPrice.trim() !== "" ? Number(draftMinPrice) : undefined;
    const parsedMax =
      draftMaxPrice.trim() !== "" ? Number(draftMaxPrice) : undefined;

    if (
      parsedMin !== undefined &&
      parsedMax !== undefined &&
      parsedMin > parsedMax
    ) {
      alert("Giá tối thiểu không được lớn hơn giá tối đa.");
      return;
    }

    setSelected(draftSelected);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setSortOrder(draftSortOrder);

    onChange?.({
      selected: draftSelected,
      minPrice: parsedMin,
      maxPrice: parsedMax,
      sortOrder: draftSortOrder,
    });
  };

  const totalSelected =
    Object.values(draftSelected).flat().length +
    (draftMinPrice.trim() ? 1 : 0) +
    (draftMaxPrice.trim() ? 1 : 0) +
    (draftSortOrder ? 1 : 0);

  const hasPendingChanges =
    JSON.stringify(selected) !== JSON.stringify(draftSelected) ||
    minPrice !== draftMinPrice ||
    maxPrice !== draftMaxPrice ||
    sortOrder !== draftSortOrder;

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <ChipSkeleton />
      </div>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Bộ lọc</span>

        {totalSelected > 0 && (
          <button type="button" className={styles.clearAll} onClick={clearAll}>
            Xoá tất cả ({totalSelected})
          </button>
        )}
      </div>

      {/* ── Sort section ── */}
      <div className={styles.group}>
        <div className={styles.groupHeaderStatic}>
          <span className={styles.groupLabel}>Sắp xếp theo giá</span>
        </div>

        <div className="flex gap-2" style={{ padding: "8px 0" }}>
          {/* Giá tăng dần */}
          <button
            type="button"
            onClick={() =>
              setDraftSortOrder(draftSortOrder === "asc" ? null : "asc")
            }
            style={{ padding: "8px 12px" }}
            className={[
              "flex items-center gap-1.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer select-none",
              draftSortOrder === "asc"
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-500",
            ].join(" ")}
          >
            {/* Arrow up icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
            Tăng dần
          </button>

          {/* Giá giảm dần */}
          <button
            type="button"
            onClick={() =>
              setDraftSortOrder(draftSortOrder === "desc" ? null : "desc")
            }
            style={{ padding: "8px 12px" }}
            className={[
              "flex items-center gap-1.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer select-none",
              draftSortOrder === "desc"
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-500",
            ].join(" ")}
          >
            {/* Arrow down icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
            Giảm dần
          </button>
        </div>
      </div>

      {/* ── Price range section ── */}
      <div className={styles.group}>
        <div className={styles.groupHeaderStatic}>
          <span className={styles.groupLabel}>Khoảng giá</span>
        </div>

        <div className={styles.items}>
          <div className={styles.priceRow}>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Từ"
              value={draftMinPrice}
              onChange={(e) => setDraftMinPrice(e.target.value)}
              className={styles.priceInput}
            />

            <span className={styles.priceDivider}>-</span>

            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Đến"
              value={draftMaxPrice}
              onChange={(e) => setDraftMaxPrice(e.target.value)}
              className={styles.priceInput}
            />
          </div>
        </div>
      </div>

      {/* ── Filter groups ── */}
      {groups.map(([type, items]) => {
        const isCollapsed = collapsed[type];
        const selectedInGroup = (draftSelected[type] ?? []).length;
        const isBrandGroup = type === "brand";

        return (
          <div key={type} className={styles.group}>
            <button
              type="button"
              className={styles.groupHeader}
              onClick={() => toggleCollapse(type)}
            >
              <span className={styles.groupLabel}>
                {getLabel(type)}
                {selectedInGroup > 0 && (
                  <span className={styles.badge}>{selectedInGroup}</span>
                )}
              </span>

              <span
                className={`${styles.chevron} ${
                  isCollapsed ? styles.chevronClosed : ""
                }`}
              >
                ‹
              </span>
            </button>

            {!isCollapsed && (
              <div
                className={`${styles.items} ${
                  isBrandGroup ? styles.brandGrid : styles.tagList
                }`}
              >
                {items.map((item) => {
                  const isActive = (draftSelected[type] ?? []).includes(
                    item.id,
                  );
                  const logoKey = item.name.toLowerCase();
                  const hasLogo = isBrandGroup && logoKey in BRAND_LOGOS;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(type, item.id)}
                      className={`${styles.item} ${
                        isActive ? styles.itemActive : ""
                      } ${hasLogo ? styles.brandItem : styles.tagItem}`}
                    >
                      {hasLogo ? (
                        <Image
                          src={BRAND_LOGOS[logoKey]}
                          alt={item.name}
                          width={80}
                          height={40}
                          className={styles.brandLogo}
                        />
                      ) : (
                        <span>{item.name}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.applyButton}
          onClick={applyFilters}
          disabled={!hasPendingChanges}
        >
          Xác nhận lọc
        </button>
      </div>
    </aside>
  );
}
