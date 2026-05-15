"use client";

import Link from "next/link";

export default function CheckoutHeader() {
  return (
    <div style={{ marginBottom: "40px" }}>
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        style={{ marginBottom: "16px" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Quay lại Giỏ hàng
      </Link>

      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">
          Thanh Toán Đơn Hàng
        </h1>
      </div>

      {/* Breadcrumb steps */}
      <div
        className="flex items-center gap-2 text-sm"
        style={{ marginTop: "14px" }}
      >
        <span className="font-semibold text-[#0156FF]">Giỏ hàng</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="font-semibold text-slate-900">Thanh toán</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="text-slate-400">Xác nhận</span>
      </div>
    </div>
  );
}
