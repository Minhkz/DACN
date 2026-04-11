"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";

const Wishlist = () => {
  // 8 sản phẩm mẫu
  const initialProducts = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: "EX DISPLAY : MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-One...",
    oldPrice: 19990000,
    price: 17990000,
    image: "/product/msi-pro16.png"
  }));

  const [products, setProducts] = useState(initialProducts);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const isEmpty = products.length === 0;
  const selectedCount = selectedItems.size;

  const toggleSelectItem = (id: number) => {
    const newSet = new Set(selectedItems);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedItems(newSet);
  };

  const removeItem = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    const newSet = new Set(selectedItems);
    newSet.delete(id);
    setSelectedItems(newSet);
  };

  const removeSelected = () => {
    setProducts(products.filter(p => !selectedItems.has(p.id)));
    setSelectedItems(new Set());
  };

  const addSelectedToCart = () => {
    console.log("Thêm vào giỏ hàng:", Array.from(selectedItems));
  };

  return (
    <div className="bg-[#f8f9fa] min-h-[80vh] pb-28 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* ================= BREADCRUMB ================= */}
        {}
        <div className="flex items-center gap-2 text-[14px] mt-4 mb-20">
          <Link href="/" className="text-gray-500 hover:text-[#0156FF] transition-colors font-semibold">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-[#d70018] font-bold tracking-wide">Danh sách yêu thích</span>
        </div>

        {/* ================= TITLE SECTION  ================= */}
        {}
        <div className="mb-20 bg-gradient-to-r from-[#f4f8ff] to-[#fbfcff] border border-blue-100/60 p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(1,86,255,0.08)]">
          <h1 className="text-[42px] md:text-[54px] font-black tracking-tighter leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-[#0156FF] to-blue-400 drop-shadow-sm flex items-center gap-4">
            My Wishlist
          </h1>
          
          {!isEmpty && (
            <p className="mb-20 text-gray-500 text-[16px] md:text-[17px] font-medium flex items-center flex-wrap gap-2">
              Bạn đang có 
              <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-[#0156FF] rounded-lg font-bold text-lg border border-blue-100 shadow-sm">
                {products.length} sản phẩm
              </span> 
              trong danh sách yêu thích
            </p>
          )}
        </div>

        {isEmpty ? (
          /* ================= UI KHI TRỐNG ================= */
          <div className=" mt-20 mb-20 flex flex-col items-center justify-center py-28 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="relative w-36 h-36 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <div className="absolute inset-0 bg-[#0156FF] opacity-10 rounded-full animate-ping"></div>
              <svg className="w-16 h-16 text-[#0156FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h2 className="text-[26px] font-bold text-gray-800 mb-3">Danh sách yêu thích trống</h2>
            <p className="text-gray-500 mb-20 text-center max-w-md text-[16px] leading-relaxed">
              Hãy lướt xem và lưu lại những mẫu laptop bạn ưng ý nhất để không bỏ lỡ các ưu đãi nhé!
            </p>
            <Link href="/catalogs" className="px-10 py-4 rounded-full bg-[#0156FF] hover:bg-blue-800 text-white font-semibold transition-all shadow-lg shadow-blue-500/30 hover:translate-y-[-2px]">
              Khám phá sản phẩm ngay
            </Link>
          </div>
        ) : (
          /* ================= UI CÓ SẢN PHẨM ================= */
          <div className=" mb-20 flex flex-col lg:flex-row gap-8">
            
            {}
            <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0">
              <div className="relative h-full min-h-[400px] lg:min-h-[600px] rounded-[2rem] overflow-hidden group shadow-lg border border-gray-200/50">
                <img 
                  src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop" 
                  alt="Promo Banner" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className="inline-block px-3 py-1.5 bg-[#0156FF] text-white text-[11px] font-bold uppercase tracking-widest rounded-full mb-4 w-max shadow-md">
                    Ưu đãi độc quyền
                  </span>
                  <h2 className="text-white text-4xl font-extrabold mb-4 leading-tight drop-shadow-md">
                    Nâng Tầm <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Trải Nghiệm</span>
                  </h2>
                  <p className="text-gray-300 text-[14px] mb-8 leading-relaxed">
                    Giảm ngay 20% cho các phụ kiện Gaming khi mua kèm Laptop có trong danh sách yêu thích của bạn.
                  </p>
                  <Link href="/catalogs" className="flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors w-max group/link">
                    Xem bộ sưu tập
                    <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {}
            <div className="flex-1 flex flex-col">
              
              {}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                {products.map((product) => {
                  const isSelected = selectedItems.has(product.id);
                  return (
                    <div 
                      key={product.id} 
                      className={`relative group transition-all duration-300 bg-white rounded-2xl overflow-hidden flex flex-col p-4 border shadow-sm hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'border-[#0156FF] ring-1 ring-[#0156FF]' : 'border-gray-200/80'}`}
                    >
                      {}
                      <div className="flex justify-between items-center mb-2 z-10 relative">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="cursor-pointer w-[18px] h-[18px] rounded border-gray-300 text-[#0156FF] focus:ring-[#0156FF]"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(product.id)}
                          />
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                            <CheckCircle2 size={12} /> in stock
                          </span>
                        </div>
                        <button 
                          onClick={() => removeItem(product.id)}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {}
                      <div className="w-full h-36 mb-4 flex items-center justify-center bg-white relative rounded-lg overflow-hidden p-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {}
                      <div className="flex items-center gap-1 mb-2 text-[#fbad18] text-[11px]">
                        <span>★★★★☆</span>
                        <span className="text-gray-400 ml-1 font-medium">Đánh giá (4)</span>
                      </div>

                      {}
                      <h3 className="text-[13px] font-bold line-clamp-2 mb-3 text-gray-800 h-[38px] group-hover:text-[#0156FF] transition-colors leading-tight">
                        {product.name}
                      </h3>

                      {}
                      <div className="mb-4 mt-auto border-t border-dashed border-gray-200 pt-3">
                        <p className="text-gray-400 text-[12px] line-through mb-0.5 font-medium">
                          {product.oldPrice.toLocaleString("vi-VN")} ₫
                        </p>
                        <p className="text-gray-900 font-extrabold text-[16px]">
                          {product.price.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>

                      {}
                      <div className="flex gap-2 mt-auto relative z-10">
                        <Link
                          href={`/product/${product.id}`}
                          className="flex-1 text-center text-[12px] py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-200 hover:text-black font-bold transition-colors"
                        >
                          Chi tiết
                        </Link>
                        <button className="flex-1 text-[12px] py-2.5 bg-[#0156FF] text-white rounded-xl hover:bg-blue-800 flex items-center justify-center gap-1.5 font-bold shadow-md shadow-blue-500/20 transition-colors">
                          <ShoppingCart size={14} /> Thêm giỏ
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= THANH ACTION BAR ================= */}
              {}
              <div className="mt-20 bg-white border border-gray-200 shadow-[0_12px_40px_rgb(0,0,0,0.08)] p-6 sm:px-8 py-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6">
                
                <div className="flex items-center gap-4 w-full sm:w-auto bg-blue-50/50 px-5 py-3 rounded-xl border border-blue-100">
                  <span className="text-[16px] font-medium text-gray-700">
                    Đã chọn: <strong className="text-[#0156FF] text-2xl ml-2">{selectedCount}</strong>
                  </span>
                </div>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={removeSelected}
                    disabled={selectedCount === 0}
                    className="flex-1 sm:flex-none px-8 py-4 rounded-xl text-red-500 font-bold bg-white border-2 border-red-100 hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-red-100 disabled:cursor-not-allowed text-[15px]"
                  >
                    Xóa mục chọn
                  </button>
                  <button 
                    onClick={addSelectedToCart}
                    disabled={selectedCount === 0}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-[#0156FF] hover:bg-blue-800 disabled:bg-gray-300 disabled:shadow-none text-white font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed text-[15px]"
                  >
                    <ShoppingCart size={20} />
                    Thêm tất cả vào giỏ
                  </button>
                </div>
                
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;