"use client";

import Header from "@/component/Header/Header";
import Footer from "@/component/Footer/Footer";
import { useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Laptop ABC", price: 12990000, qty: 1, image: "/product/msi-pro16.png" },
    { id: 2, name: "Chuột không dây", price: 350000, qty: 2, image: "/product/msi-white.png" },
    { id: 3, name: "Chuột không dây", price: 350000, qty: 2, image: "/product/detail.png" },
    { id: 4, name: "Chuột không dây", price: 350000, qty: 2, image: "/product/msi-pro16.png" },
    { id: 5, name: "Chuột không dây", price: 350000, qty: 2, image: "/product/msi-white.png" },
  ]);

  const updateQty = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(items => items.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 5000000 ? 0 : 30000; // Miễn phí nếu > 5tr
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-20">
          <div className="text-center max-w-lg mx-auto px-6">
            <div className="relative mb-8">
              <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">0</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">Khám phá các sản phẩm tuyệt vời và thêm vào giỏ hàng ngay!</p>
            <a href="/" className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Khám phá sản phẩm
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-16">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-3">Giỏ hàng của bạn</h1>
                <p className="text-xl text-gray-600">{cartItems.length} sản phẩm trong giỏ</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">An toàn & Bảo mật</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
            <div className="xl:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-10 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">Sản phẩm đã chọn</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{cartItems.length} items</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-10 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 group">
                      <div className="flex items-center space-x-10">
                        <div className="relative w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "/img/banner.png";
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors truncate">{item.name}</h3>
                          <p className="text-lg text-gray-600 mb-2">{item.price.toLocaleString("vi-VN")}₫ / sản phẩm</p>
                          <div className="flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">Còn hàng</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="flex items-center border-2 border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="p-4 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-2xl"
                              disabled={item.qty <= 1}
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="px-6 py-4 text-center min-w-[5rem] font-bold text-xl text-gray-900 bg-gray-50">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="p-4 hover:bg-green-50 text-gray-600 hover:text-green-600 transition-all duration-200 rounded-r-2xl"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>

                          <div className="text-right min-w-[160px]">
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                              {(item.price * item.qty).toLocaleString("vi-VN")}₫
                            </p>
                            <p className="text-sm text-gray-500">Đã bao gồm VAT</p>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-110"
                            title="Xóa sản phẩm"
                          >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 sticky top-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Tóm tắt đơn hàng</h2>
                  <p className="text-gray-600">Xem lại và xác nhận đơn hàng của bạn</p>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl text-gray-700 font-medium">Tạm tính</span>
                      <span className="text-xl font-semibold text-gray-900">{subtotal.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl text-gray-700 font-medium">Số lượng sản phẩm</span>
                      <span className="text-xl font-semibold text-gray-900">{cartItems.length} items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl text-gray-700 font-medium">Phí vận chuyển</span>
                      <span className={`text-xl font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                        {shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString("vi-VN")}₫`}
                      </span>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
                      <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="text-lg font-semibold text-blue-900 mb-1">Miễn phí vận chuyển!</h4>
                          <p className="text-base text-blue-800">Thêm {(5000000 - subtotal).toLocaleString("vi-VN")}₫ nữa để được miễn phí giao hàng.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-200 pt-8">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-4xl font-bold text-gray-900">Tổng cộng</span>
                      <span className="text-4xl font-bold text-blue-600">{total.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center text-green-800">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Đảm bảo giá tốt nhất</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-6 px-4 rounded-3xl hover:from-green-600 hover:to-green-700 transition-all font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 flex items-center justify-center">
                  <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13L5.4 5" />
                  </svg>
                  Tiến hành thanh toán
                </button>

                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>SSL bảo mật</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Thanh toán đa dạng</span>
                    </div>
                  </div>

                  <a
                    href="/"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-semibold text-lg group"
                  >
                    <svg className="w-6 h-6 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Tiếp tục mua sắm
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}