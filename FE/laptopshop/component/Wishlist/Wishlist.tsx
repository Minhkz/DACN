"use client";

import React, { useState } from "react";
import { Breadcrumb } from "antd";
import Link from "next/link";
import CardProduct from "@/component/Product/CardProduct/CardProduct";

const Wishlist = () => {
  const [isEmpty, setIsEmpty] = useState(false);

  return (
    <div className="bg-[#f8fafc] min-h-[85vh] pb-24 font-sans">
      <div className="container-global pt-8">
        
        {}
        <div className="pb-6">
          <Breadcrumb
            className="text-[14px] text-gray-500 font-medium"
            separator={<span className="text-gray-300">/</span>}
            items={[
              { title: <Link href="/" className="hover:text-[#0156FF] transition-colors">Trang chủ</Link> },
              { title: <span className="text-[#0156FF]">Danh sách yêu thích</span> },
            ]}
          />
        </div>

        {}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              My Wishlist
            </h1>
            {!isEmpty && (
              <p className="text-gray-500 mt-3 text-[15px]">
                Bạn đang có <span className="font-bold text-[#0156FF]">4</span> sản phẩm trong danh sách
              </p>
            )}
          </div>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white rounded-3xl shadow-sm border border-gray-100 mt-4">
            <div className="relative w-32 h-32 bg-blue-50/80 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <svg className="w-14 h-14 text-[#0156FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Bạn chưa thích sản phẩm nào!</h2>
            <p className="text-gray-500 mb-10 text-center max-w-md text-[15px]">
              Đừng bỏ lỡ những mẫu laptop với cấu hình cực khủng và mức giá vô cùng hấp dẫn đang chờ đón bạn.
            </p>
            <Link
              href="/catalogs"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0156FF] hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 text-white font-semibold text-[15px]"
            >
              Khám phá ngay
            </Link>
          </div>
        ) : (
        
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-7 mb-14">
              {[1, 2, 3, 4].map((item, index) => (
                <div 
                  key={index} 
                  className="relative group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl rounded-2xl bg-white"
                >
                  {/* Nút Xóa Khỏi Wishlist */}
                  <button 
                    className="absolute top-3 right-3 z-30 w-8 h-8 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Xóa khỏi danh sách"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>

                  {}
                  <div className="relative z-10 w-full h-full overflow-hidden rounded-2xl">
                    <CardProduct />
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-sm border border-gray-100 p-4 md:px-8 md:py-5 rounded-full gap-4">
              
              <Link
                href="/catalogs"
                className="group w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-gray-100 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <span>&larr;</span> Tiếp tục mua sắm
              </Link>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 rounded-full text-red-500 font-semibold hover:bg-red-50 hover:text-red-600 transition-colors">
                  Xóa tất cả
                </button>
                
                <button className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3 rounded-full bg-[#0156FF] hover:bg-blue-700 text-white font-semibold shadow-md transition-all">
                  Thêm tất cả vào giỏ
                </button>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;