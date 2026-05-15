"use client";

import Image from "next/image";

interface CheckoutItem {
  id: number;
  productId: number;
  name: string;
  qty: number;
  price: string;
  imageUrl?: string;
}

interface OrderSummaryProps {
  cartItems: CheckoutItem[];
  subtotal: string;
  shipping: string;
  discount: string;
  total: string;
  ordering?: boolean;
  onPlaceOrder: () => void;
}

export default function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  discount,
  total,
  ordering = false,
  onPlaceOrder,
}: OrderSummaryProps) {
  return (
    <aside
      className="bg-white border border-slate-200 rounded-2xl sticky top-8"
      style={{
        padding: "28px",
        boxShadow: "0 8px 32px rgba(15, 23, 42, 0.07)",
      }}
    >
      <h2
        className="text-lg font-bold text-slate-900"
        style={{
          paddingBottom: "18px",
          marginBottom: "18px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        Đơn hàng
        <span
          className="ml-2 text-sm font-semibold text-slate-400 bg-slate-100 rounded-full"
          style={{ padding: "2px 10px" }}
        >
          {cartItems.length} sản phẩm
        </span>
      </h2>

      <div
        className="flex flex-col"
        style={{
          gap: "16px",
          paddingBottom: "20px",
          marginBottom: "20px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-xl overflow-hidden"
                style={{ width: "44px", height: "44px" }}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "📦"
                )}
              </div>

              <div className="min-w-0">
                <p className="text-slate-800 font-semibold text-sm leading-snug line-clamp-2">
                  {item.name}
                </p>

                <p
                  className="text-slate-400 text-xs"
                  style={{ marginTop: "3px" }}
                >
                  Số lượng: {item.qty}
                </p>
              </div>
            </div>

            <span className="text-slate-900 font-bold text-sm whitespace-nowrap flex-shrink-0">
              {item.price}
            </span>
          </div>
        ))}
      </div>

      <div
        className="flex flex-col"
        style={{
          gap: "12px",
          paddingBottom: "20px",
          marginBottom: "20px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>Tạm tính</span>
          <span className="font-semibold text-slate-900">{subtotal}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-slate-900">{shipping}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-emerald-600">Giảm giá</span>
          <span className="font-semibold text-emerald-600">- {discount}</span>
        </div>
      </div>

      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "6px" }}
      >
        <span className="text-base font-bold text-slate-900">
          Tổng thanh toán
        </span>

        <span className="text-2xl font-bold text-red-500">{total}</span>
      </div>

      <p
        className="text-right text-xs text-slate-400"
        style={{ marginBottom: "28px" }}
      >
        (Đã bao gồm VAT nếu có)
      </p>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={ordering}
        className={`w-full text-white font-bold rounded-xl text-base transition-all ${
          ordering
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-[#0156FF] hover:bg-blue-700 active:scale-[0.98]"
        }`}
        style={{
          padding: "16px",
          marginBottom: "20px",
          boxShadow: ordering ? "none" : "0 12px 28px rgba(1, 86, 255, 0.22)",
        }}
      >
        {ordering ? "Đang đặt hàng..." : "Đặt hàng ngay"}
      </button>

      <p className="text-xs text-center text-slate-400 leading-relaxed">
        Bằng việc đặt hàng, bạn đồng ý với{" "}
        <a href="#" className="text-[#0156FF] hover:underline font-medium">
          Điều khoản LaptopShop
        </a>
      </p>
    </aside>
  );
}
