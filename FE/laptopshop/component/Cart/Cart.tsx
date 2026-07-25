"use client";

import Header from "@/component/Header/Header";
import Footer from "@/component/Footer/Footer";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import CartItem from "@/component/Cart/CartItem";
import {
  fetchCart,
  removeFromCart,
  updateCartQuantity,
  clearCartProducts,
} from "@/store/slices/cartSlice";

const currency = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading, pendingProductIds } = useSelector(
    (state: RootState) => state.cart,
  );

  const handleUpdateQty = (productId: number, newQty: number) => {
    if (newQty < 1) return;
    dispatch(updateCartQuantity({ productId, quantity: newQty }));
  };

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleClearCart = () => {
    dispatch(clearCartProducts());
  };

  const subtotal = useMemo(
    () =>
      (cart?.items ?? []).reduce(
        (sum, item) => sum + (item.price ?? 0) * (item.qty ?? 0),
        0,
      ),
    [cart, cart?.items],
  );
  const shipping = subtotal > 5000000 ? 0 : 30000;
  const total = subtotal + shipping;

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <main
        className="min-h-screen bg-[#F5F7FF]"
        style={{ padding: "40px 16px" }}
      >
        <section className="container-global mx-auto max-w-6xl">
          {/* Breadcrumb Skeleton */}
          <div
            className="bg-slate-200 rounded-md animate-pulse"
            style={{ height: "16px", width: "128px", marginBottom: "24px" }}
          />

          {/* Header Skeleton */}
          <div
            className="bg-white border border-slate-100 rounded-2xl shadow-sm animate-pulse"
            style={{ padding: "28px", marginBottom: "24px" }}
          >
            <div
              className="bg-slate-200 rounded-lg"
              style={{ height: "36px", width: "224px", marginBottom: "12px" }}
            />
            <div
              className="bg-slate-100 rounded-md"
              style={{ height: "16px", width: "384px" }}
            />
          </div>

          <div
            className="flex flex-col lg:flex-row items-start"
            style={{ gap: "24px" }}
          >
            {/* List Skeleton */}
            <div
              className="flex-[2] w-full flex flex-col"
              style={{ gap: "16px" }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-100 rounded-2xl shadow-sm animate-pulse flex items-center"
                  style={{
                    padding: "24px",
                    height: "140px",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    className="bg-slate-200 rounded-xl"
                    style={{ width: "80px", height: "80px" }}
                  />
                  <div
                    className="flex-1"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      className="bg-slate-200 rounded-md"
                      style={{ height: "16px", width: "66%" }}
                    />
                    <div
                      className="bg-slate-100 rounded-md"
                      style={{ height: "12px", width: "33%" }}
                    />
                  </div>
                  <div
                    className="bg-slate-200 rounded-lg"
                    style={{ width: "96px", height: "32px" }}
                  />
                </div>
              ))}
            </div>

            {/* Sidebar Skeleton */}
            <div
              className="flex-1 min-w-[320px] w-full bg-white border border-slate-100 rounded-2xl shadow-sm animate-pulse"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                className="bg-slate-200 rounded-md"
                style={{ height: "24px", width: "144px" }}
              />
              <div
                className="bg-slate-100 rounded-md"
                style={{ height: "16px", width: "100%" }}
              />
              <div
                style={{
                  borderTop: "1px solid #f1f5f9",
                  borderBottom: "1px solid #f1f5f9",
                  padding: "16px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div className="flex justify-between">
                  <div
                    className="bg-slate-100 rounded"
                    style={{ height: "16px", width: "64px" }}
                  />
                  <div
                    className="bg-slate-200 rounded"
                    style={{ height: "16px", width: "80px" }}
                  />
                </div>
                <div className="flex justify-between">
                  <div
                    className="bg-slate-100 rounded"
                    style={{ height: "16px", width: "80px" }}
                  />
                  <div
                    className="bg-slate-200 rounded"
                    style={{ height: "16px", width: "48px" }}
                  />
                </div>
              </div>
              <div
                className="bg-slate-200 rounded-xl"
                style={{ height: "48px", width: "100%" }}
              />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <main
        className="min-h-screen bg-[#F5F7FF]"
        style={{ padding: "40px 16px" }}
      >
        <section
          className="container-global mx-auto max-w-6xl"
          style={{ padding: "0 0 64px 0" }}
        >
          {/* Breadcrumb */}
          <nav
            className="flex items-center text-xs font-semibold text-slate-500"
            style={{ gap: "8px", marginBottom: "24px" }}
          >
            <Link href="/" className="hover:text-[#0156FF] transition-colors">
              Trang chủ
            </Link>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span className="text-[#0156FF] font-bold">Giỏ hàng</span>
          </nav>

          {/* Header card */}
          <div
            className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
            style={{ padding: "24px 32px", marginBottom: "24px", gap: "16px" }}
          >
            <div>
              <h1
                className="text-3xl font-extrabold text-slate-900 tracking-tight"
                style={{ margin: 0 }}
              >
                Giỏ hàng của bạn
              </h1>
              {cart?.username && (
                <p
                  className="text-slate-500 text-sm leading-relaxed"
                  style={{ margin: "6px 0 0 0" }}
                >
                  Xin chào{" "}
                  <strong className="text-slate-800 font-semibold">
                    {cart.username}
                  </strong>{" "}
                  — kiểm tra lại đơn hàng trước khi thanh toán.
                </p>
              )}
            </div>

            {cart && cart.items.length > 0 && (
              <div
                className="self-start md:self-center bg-blue-50/70 border border-blue-100 rounded-full text-[#0156FF] text-xs font-bold flex items-center"
                style={{ padding: "8px 16px", gap: "6px" }}
              >
                <span className="w-2 h-2 rounded-full bg-[#0156FF] animate-pulse" />
                {cart.items.length} sản phẩm
              </div>
            )}
          </div>

          {/* Giỏ rỗng */}
          {!cart || cart.items.length === 0 ? (
            <div
              className="bg-white border border-slate-100 rounded-2xl text-center shadow-sm max-w-2xl mx-auto"
              style={{ padding: "64px 24px", margin: "32px auto" }}
            >
              <div
                className="relative bg-blue-50 rounded-full flex items-center justify-center group overflow-hidden"
                style={{ width: "96px", height: "96px", margin: "0 auto 24px" }}
              >
                <div className="absolute inset-0 bg-blue-100 rounded-full scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
                <svg
                  className="w-10 h-10 text-[#0156FF] z-10 transition-transform duration-500 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6H21L19 15H8L6 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L5.2 4.3C5.04 3.97 4.71 3.75 4.34 3.75H2.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="9" cy="19" r="1.5" fill="currentColor" />
                  <circle cx="18" cy="19" r="1.5" fill="currentColor" />
                </svg>
              </div>

              <h2
                className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight"
                style={{ margin: "0 0 12px 0" }}
              >
                Giỏ hàng đang trống
              </h2>

              <p
                className="text-slate-500 text-sm max-w-md leading-relaxed"
                style={{ margin: "0 auto 32px" }}
              >
                Hãy tiếp tục khám phá sản phẩm để thêm vào giỏ và hoàn tất đơn
                hàng.
              </p>

              <Link
                href="/categories"
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#0156FF] to-[#004ee6] text-white font-bold text-sm shadow-[0_8px_20px_rgba(1,86,255,0.2)] hover:shadow-[0_12px_28px_rgba(1,86,255,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                style={{ padding: "14px 32px", borderRadius: "12px" }}
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div
              className="flex flex-col lg:flex-row items-start w-full"
              style={{ gap: "24px" }}
            >
              {/* Danh sách sản phẩm */}
              <div
                className="flex-[2] w-full flex flex-col"
                style={{ gap: "16px" }}
              >
                {/* Toolbar xóa tất cả */}
                <div
                  className="flex justify-between items-center bg-white border border-slate-100 rounded-xl shadow-sm"
                  style={{ padding: "14px 20px" }}
                >
                  <span className="text-xs font-bold text-slate-500">
                    Sản phẩm trong giỏ ({cart.items.length})
                  </span>

                  <button
                    onClick={handleClearCart}
                    className="flex items-center text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-100 rounded-lg transition-all duration-300 cursor-pointer"
                    style={{ padding: "6px 12px", gap: "6px" }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Xóa tất cả
                  </button>
                </div>

                <div className="flex flex-col" style={{ gap: "16px" }}>
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      isPending={pendingProductIds.includes(item.productId)}
                      onUpdateQty={handleUpdateQty}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar tóm tắt */}
              <aside
                className="flex-1 min-w-[320px] w-full bg-white border border-slate-100 rounded-2xl shadow-sm sticky"
                style={{ padding: "24px", top: "24px" }}
              >
                <h2
                  className="text-xl font-bold text-slate-900 tracking-tight"
                  style={{ margin: 0 }}
                >
                  Tóm tắt đơn hàng
                </h2>
                <p
                  className="text-slate-500 text-xs"
                  style={{ marginTop: "6px" }}
                >
                  Kiểm tra nhanh chi phí trước khi tiến hành thanh toán.
                </p>

                <div
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    borderBottom: "1px solid #f1f5f9",
                    padding: "20px 0",
                    margin: "20px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-slate-900">
                      {currency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <span>Vận chuyển</span>
                    {shipping === 0 ? (
                      <span
                        className="bg-emerald-50 text-emerald-700 font-bold text-xs"
                        style={{ padding: "2px 8px", borderRadius: "6px" }}
                      >
                        Miễn phí
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-900">
                        {currency(shipping)}
                      </span>
                    )}
                  </div>

                  <div
                    style={{ borderTop: "1px dashed #f1f5f9", margin: "8px 0" }}
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900">
                      Tổng cộng
                    </span>
                    <span className="text-xl font-extrabold text-[#0156FF] tracking-tight">
                      {currency(total)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <Link
                    href="/checkout"
                    className="h-12 rounded-xl bg-gradient-to-r from-[#0156FF] to-[#004ee6] text-white font-bold text-sm shadow-[0_8px_20px_rgba(1,86,255,0.2)] hover:shadow-[0_12px_28px_rgba(1,86,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                    style={{ gap: "8px" }}
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Tiến hành thanh toán
                  </Link>

                  <Link
                    href="/categories"
                    className="h-12 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-sm transition-all duration-300 flex items-center justify-center"
                    style={{ gap: "6px" }}
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
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
