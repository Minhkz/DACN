"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { clearCartProducts } from "@/store/slices/cartSlice";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const code = searchParams.get("code");

  const isSuccess = status === "success";

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearCartProducts());
    }
  }, [dispatch, isSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
      <div
        className="bg-white rounded-3xl border border-slate-100/50 shadow-[0_20px_50px_rgba(15,23,42,0.08)] w-full max-w-md text-center"
        style={{
          padding: "40px",
        }}
      >
        {/* Biểu tượng trạng thái thiết kế Vector động */}
        <div
          className="flex justify-center"
          style={{
            marginBottom: "24px",
          }}
        >
          {isSuccess ? (
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm animate-pulse">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        <h1
          className="text-2xl font-extrabold text-slate-900 tracking-tight"
          style={{
            marginBottom: "8px",
          }}
        >
          {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
        </h1>

        <p
          className="text-slate-500 text-sm leading-relaxed"
          style={{
            marginBottom: "24px",
          }}
        >
          {isSuccess
            ? "Cảm ơn bạn đã đặt hàng! Giao dịch của bạn đã được xử lý hoàn tất."
            : "Rất tiếc, giao dịch thanh toán đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý."}
        </p>

        {/* Hóa đơn tóm tắt (Invoice card) */}
        <div
          className="bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col text-sm"
          style={{ padding: "16px 20px", gap: "10px" }}
        >
          <div className="flex justify-between items-center text-slate-500">
            <span>Mã đơn hàng</span>
            <strong className="text-slate-800 font-bold">{orderId}</strong>
          </div>

          {!isSuccess && code && (
            <>
              <div className="border-t border-dashed border-slate-200/60" />
              <div className="flex justify-between items-center text-rose-500">
                <span>Mã lỗi VNPay</span>
                <span className="font-extrabold">{code}</span>
              </div>
            </>
          )}
        </div>

        {/* Các nút điều hướng */}
        <div
          className="flex gap-3"
          style={{
            marginTop: "32px",
          }}
        >
          <button
            type="button"
            onClick={() => router.push(`/orders/${orderId}`)}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-[0_8px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center"
          >
            Xem đơn hàng
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 h-12 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-sm transition-all duration-300 cursor-pointer active:scale-[0.98] flex items-center justify-center"
          >
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
