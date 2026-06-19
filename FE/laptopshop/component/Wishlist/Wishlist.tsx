"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import WishlistCard from "./WishlistItem";
import { Spin } from "antd";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const { wishlist, loading, error } = useAppSelector((s) => s.wishlist);

  const wishlistId = useAppSelector((s) => s.wishlist.wishlist?.id ?? null);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const items = wishlist?.items ?? [];
  const isEmpty = items.length === 0;
  const selectedCount = selectedItems.length;

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleRemove = (productId: number) => {
    if (!wishlistId) return;
    dispatch(removeFromWishlist({ productId }));
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
  };

  const handleRemoveSelected = () => {
    if (!wishlistId) return;
    selectedItems.forEach((productId) =>
      dispatch(removeFromWishlist({ productId })),
    );
    setSelectedItems([]);
  };

  const handleAddToCart = (productId: number) => {
    console.log("Add to cart:", productId);
  };

  const handleAddSelectedToCart = () => {
    console.log("Add selected to cart:", selectedItems);
  };

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (loading)
    return (
      <main
        className="min-h-screen bg-[#F5F7FF] flex items-center justify-center"
        style={{ padding: "24px" }}
      >
        <div className="flex flex-col items-center" style={{ gap: "12px" }}>
          <Spin size="large" />
          <span className="text-slate-400 text-sm font-semibold">
            Đang tải danh sách...
          </span>
        </div>
      </main>
    );

  // ─── Error state ───────────────────────────────────────────────────────────
  if (error)
    return (
      <main
        className="min-h-screen bg-[#F5F7FF] flex items-center justify-center"
        style={{ padding: "24px" }}
      >
        <div
          className="bg-white border border-red-100 rounded-2xl text-center shadow-sm max-w-md"
          style={{ padding: "32px 24px" }}
        >
          <div
            className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto"
            style={{ marginBottom: "16px" }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3
            className="text-base font-bold text-slate-900"
            style={{ marginBottom: "8px" }}
          >
            Đã xảy ra lỗi
          </h3>
          <p
            className="text-sm text-slate-500 leading-relaxed"
            style={{ marginBottom: "24px" }}
          >
            Không thể tải wishlist. Vui lòng thử lại sau.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Tải lại trang
          </button>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#F5F7FF]">
      <section
        className="container-global mx-auto max-w-6xl"
        style={{ padding: "42px 0 64px 0" }}
      >
        {/* Breadcrumb */}
        <nav
          className="flex items-center text-xs font-semibold text-slate-500"
          style={{ gap: "8px", marginBottom: "20px" }}
        >
          <Link href="/" className="hover:text-[#0156FF] transition-colors">
            Trang chủ
          </Link>
          <span style={{ color: "#cbd5e1" }}>/</span>
          <span className="text-[#0156FF] font-bold">Wishlist</span>
        </nav>

        {/* Header */}
        <div
          className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
          style={{ padding: "28px 32px", marginBottom: "24px", gap: "16px" }}
        >
          <div>
            <h1
              className="text-3xl font-extrabold text-slate-900 tracking-tight"
              style={{ margin: 0 }}
            >
              Danh sách yêu thích
            </h1>
            <p
              className="text-slate-500 text-sm leading-relaxed"
              style={{ margin: "6px 0 0 0" }}
            >
              {isEmpty
                ? "Danh sách yêu thích của bạn hiện chưa có sản phẩm nào."
                : "Xem lại và quản lý các sản phẩm bạn đã lưu để đặt hàng nhanh chóng."}
            </p>
          </div>

          {!isEmpty && (
            <div
              className="self-start md:self-center bg-blue-50/70 border border-blue-100 rounded-full text-[#0156FF] text-xs font-bold flex items-center"
              style={{ padding: "8px 16px", gap: "6px" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#0156FF] animate-pulse" />
              {items.length} sản phẩm
            </div>
          )}
        </div>

        {/* Trạng thái trống */}
        {isEmpty ? (
          <div
            className="bg-white border border-slate-100 rounded-2xl text-center shadow-sm max-w-2xl mx-auto"
            style={{ padding: "64px 24px", margin: "32px auto" }}
          >
            <div
              className="relative bg-rose-50 rounded-full flex items-center justify-center group overflow-hidden"
              style={{ width: "96px", height: "96px", margin: "0 auto 24px" }}
            >
              <div className="absolute inset-0 bg-rose-100 rounded-full scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
              <svg
                className="w-10 h-10 text-rose-500 z-10 transition-transform duration-500 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 20.5C11.82 20.5 11.63 20.43 11.49 20.29L4.91 13.84C3.08 12.04 3.03 9.09 4.8 7.3C6.57 5.5 9.5 5.45 11.33 7.25L12 7.92L12.67 7.25C14.5 5.45 17.43 5.5 19.2 7.3C20.97 9.09 20.92 12.04 19.09 13.84L12.51 20.29C12.37 20.43 12.18 20.5 12 20.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight"
              style={{ margin: 0 }}
            >
              Chưa có sản phẩm yêu thích
            </h2>

            <p
              className="text-slate-500 text-sm max-w-md leading-relaxed"
              style={{ margin: "12px auto 28px" }}
            >
              Bạn có thể thêm các sản phẩm quan tâm vào wishlist để theo dõi và
              mua sau.
            </p>

            <Link
              href="/catalogs"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#0156FF] to-[#004ee6] text-white font-bold text-sm shadow-[0_8px_20px_rgba(1,86,255,0.2)] hover:shadow-[0_12px_28px_rgba(1,86,255,0.3)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ padding: "14px 32px", borderRadius: "12px" }}
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div
              className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
              style={{
                padding: "20px 24px",
                marginBottom: "20px",
                gap: "16px",
              }}
            >
              <div>
                <div
                  className="text-xl font-bold text-slate-900 tracking-tight"
                  style={{ marginBottom: "4px" }}
                >
                  Sản phẩm đã lưu
                </div>
                <div className="text-slate-500 text-xs leading-relaxed">
                  Chọn các mục bên dưới để thao tác nhanh hàng loạt.
                </div>
              </div>

              <div
                className="bg-blue-50 text-[#0156FF] border border-blue-100 rounded-xl text-xs font-extrabold flex items-center"
                style={{ padding: "8px 14px", gap: "6px" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0156FF] animate-pulse" />
                Đã chọn {selectedCount} mục
              </div>
            </div>

            {/* Grid danh sách */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {items.map((item) => (
                <WishlistCard
                  key={item.productId}
                  item={item}
                  isSelected={selectedItems.includes(item.productId)}
                  onToggleSelect={toggleSelectItem}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Bottom Bar thực thi hành động */}
            <div
              className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
              style={{ padding: "20px 24px", marginTop: "24px", gap: "16px" }}
            >
              <div
                className="text-sm font-semibold text-slate-600"
                style={{ margin: 0 }}
              >
                Đã chọn{" "}
                <strong className="text-[#0156FF] font-extrabold">
                  {selectedCount}
                </strong>{" "}
                sản phẩm
              </div>

              <div
                className="flex flex-wrap items-center"
                style={{ gap: "12px" }}
              >
                <button
                  onClick={handleRemoveSelected}
                  disabled={selectedCount === 0}
                  className={`h-11 rounded-xl border font-bold text-sm transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    selectedCount === 0
                      ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                      : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white cursor-pointer active:scale-[0.98]"
                  }`}
                  style={{ minWidth: "150px" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Xóa mục chọn
                </button>

                <button
                  onClick={handleAddSelectedToCart}
                  disabled={selectedCount === 0}
                  className={`h-11 rounded-xl border-none font-bold text-sm transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    selectedCount === 0
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#0156FF] to-[#004ee6] text-white shadow-[0_8px_20px_rgba(1,86,255,0.2)] hover:shadow-[0_12px_28px_rgba(1,86,255,0.3)] hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]"
                  }`}
                  style={{ minWidth: "190px" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Thêm tất cả vào giỏ
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Wishlist;
