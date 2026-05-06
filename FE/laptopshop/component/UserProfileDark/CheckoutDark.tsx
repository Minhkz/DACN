"use client";

import React, { useState } from "react";

export default function CheckoutLight() {
  // Quản lý trạng thái chọn phương thức thanh toán
  // Mặc định chọn "cod" (Thanh toán khi nhận hàng)
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Dữ liệu giả lập sản phẩm trong giỏ hàng
  const cartItems = [
    { id: 1, name: "Laptop MSI Gaming Titan 18", qty: 1, price: "85.000.000đ", icon: "💻" },
    { id: 2, name: "Chuột không dây Logitech", qty: 2, price: "1.000.000đ", icon: "🖱️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800" style={{ padding: '40px 16px' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* ==========================================
            HEADER TRANG THANH TOÁN
        ========================================== */}
        <div style={{ marginBottom: '40px' }}>
          <button type="button" className="text-gray-500 font-bold hover:text-gray-900 flex items-center transition-colors" style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>&lt;</span> Quay lại Giỏ hàng
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh Toán Đơn Hàng</h1>
        </div>

        {/* ==========================================
            KHUNG BỐ CỤC 2 CỘT
        ========================================== */}
        <div className="flex flex-col lg:flex-row w-full" style={{ gap: '32px' }}>
          
          {/* ====== CỘT TRÁI (THÔNG TIN GIAO HÀNG & THANH TOÁN) ====== */}
          <div className="flex-[2] w-full">
            
            {/* 1. Thông tin giao hàng */}
            <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '20px' }}>1. Thông tin giao hàng</h2>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex items-start" style={{ padding: '24px', marginBottom: '40px' }}>
              <div className="text-2xl" style={{ marginRight: '20px' }}>📍</div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center" style={{ marginBottom: '8px' }}>
                  <h3 className="text-lg font-bold text-gray-900">Nguyễn Văn A | 0123 456 789</h3>
                  <button type="button" className="text-[#1A73E8] font-bold text-sm hover:underline self-start sm:self-auto" style={{ marginTop: '8px' }}>
                    Thay đổi
                  </button>
                </div>
                <p className="text-gray-600 text-sm md:text-base" style={{ marginBottom: '8px' }}>
                  48 P. Lý Thường Kiệt, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội
                </p>
                <p className="text-sm text-gray-500 italic">
                  Ghi chú: Giao giờ hành chính
                </p>
              </div>
            </div>

            {/* 2. Phương thức thanh toán */}
            <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '20px' }}>2. Phương thức thanh toán</h2>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              
              {/* Option 1: COD */}
              <div 
                onClick={() => setPaymentMethod("cod")}
                className={`rounded-xl border-2 flex items-center cursor-pointer transition-all ${paymentMethod === "cod" ? "bg-blue-50 border-[#1A73E8]" : "bg-white border-gray-200 hover:border-gray-300"}`} 
                style={{ padding: '20px' }}
              >
                <div className={`text-2xl ${paymentMethod === "cod" ? "text-[#1A73E8]" : "text-gray-400"}`} style={{ marginRight: '16px' }}>
                  {paymentMethod === "cod" ? "◉" : "◯"}
                </div>
                <div className="text-3xl" style={{ marginRight: '16px' }}>💵</div>
                <div className={`font-bold text-base md:text-lg ${paymentMethod === "cod" ? "text-gray-900" : "text-gray-700"}`}>
                  Thanh toán khi nhận hàng (COD)
                </div>
              </div>

              {/* Option 2: Chuyển khoản */}
              <div 
                onClick={() => setPaymentMethod("banking")}
                className={`rounded-xl border-2 flex items-center cursor-pointer transition-all ${paymentMethod === "banking" ? "bg-blue-50 border-[#1A73E8]" : "bg-white border-gray-200 hover:border-gray-300"}`} 
                style={{ padding: '20px' }}
              >
                <div className={`text-2xl ${paymentMethod === "banking" ? "text-[#1A73E8]" : "text-gray-400"}`} style={{ marginRight: '16px' }}>
                  {paymentMethod === "banking" ? "◉" : "◯"}
                </div>
                <div className="text-3xl" style={{ marginRight: '16px' }}>💳</div>
                <div className={`font-bold text-base md:text-lg ${paymentMethod === "banking" ? "text-gray-900" : "text-gray-700"}`}>
                  Chuyển khoản Ngân hàng (Internet Banking)
                </div>
              </div>

              {/* Option 3: Ví điện tử */}
              <div 
                onClick={() => setPaymentMethod("ewallet")}
                className={`rounded-xl border-2 flex items-center cursor-pointer transition-all ${paymentMethod === "ewallet" ? "bg-blue-50 border-[#1A73E8]" : "bg-white border-gray-200 hover:border-gray-300"}`} 
                style={{ padding: '20px' }}
              >
                <div className={`text-2xl ${paymentMethod === "ewallet" ? "text-[#1A73E8]" : "text-gray-400"}`} style={{ marginRight: '16px' }}>
                  {paymentMethod === "ewallet" ? "◉" : "◯"}
                </div>
                <div className="text-3xl" style={{ marginRight: '16px' }}>📱</div>
                <div className={`font-bold text-base md:text-lg ${paymentMethod === "ewallet" ? "text-gray-900" : "text-gray-700"}`}>
                  Ví điện tử (MoMo, ZaloPay, VNPAY)
                </div>
              </div>

            </div>
          </div>

          {/* ====== CỘT PHẢI (TÓM TẮT ĐƠN HÀNG) ====== */}
          <div className="flex-1 w-full lg:max-w-[400px]">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm sticky top-8" style={{ padding: '28px' }}>
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200" style={{ paddingBottom: '20px', marginBottom: '20px' }}>
                Đơn hàng (2 sản phẩm)
              </h2>

              {/* List Sản phẩm */}
              <div className="flex flex-col border-b border-gray-200" style={{ gap: '20px', paddingBottom: '20px', marginBottom: '24px' }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center flex-1" style={{ marginRight: '16px' }}>
                      <div className="text-3xl" style={{ marginRight: '12px' }}>{item.icon}</div>
                      <div>
                        <p className="text-gray-900 font-bold text-sm line-clamp-2">{item.name}</p>
                        <p className="text-gray-500 text-xs" style={{ marginTop: '4px' }}>SL: {item.qty}</p>
                      </div>
                    </div>
                    <div className="text-gray-900 font-bold text-sm whitespace-nowrap">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bảng tính tiền */}
              <div className="flex flex-col border-b border-gray-200" style={{ gap: '16px', paddingBottom: '24px', marginBottom: '24px' }}>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-bold text-gray-900">86.000.000đ</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-gray-900">50.000đ</span>
                </div>
                <div className="flex justify-between items-center text-[#10B981]">
                  <span>Giảm giá</span>
                  <span className="font-bold">- 2.050.000đ</span>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                <span className="text-lg font-bold text-gray-900">Tổng thanh toán</span>
                <span className="text-2xl lg:text-3xl font-bold text-[#EF4444]">84.000.000đ</span>
              </div>
              <div className="text-right text-xs text-gray-500" style={{ marginBottom: '32px' }}>
                (Đã bao gồm VAT nếu có)
              </div>

              {/* Nút Đặt hàng */}
              <button 
                type="button" 
                onClick={() => alert(`Đang xử lý thanh toán qua: ${paymentMethod}`)}
                className="w-full bg-[#1A73E8] hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-500/30 transition-all" 
                style={{ padding: '16px', marginBottom: '24px' }}
              >
                ĐẶT HÀNG
              </button>

              {/* Text điều khoản */}
              <p className="text-xs text-center text-gray-500 leading-relaxed">
                Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <br/>
                <span className="text-[#1A73E8] cursor-pointer hover:underline">Điều khoản LaptopShop</span>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}