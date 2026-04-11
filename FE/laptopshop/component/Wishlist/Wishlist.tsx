"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";

const Wishlist = () => {
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
    <div className="bg-[#f8f9fa] min-h-[80vh] pb-32 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-8">
        
        {/* ================= BREADCRUMB ================= */}
        <div className="flex items-center gap-2 text-[14px] mt-2 mb-8">
          <Link href="/" className="text-gray-500 hover:text-[#0156FF] transition-colors font-semibold">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-[#d70018] font-bold tracking-wide">Danh sách yêu thích</span>
        </div>

        {/* ================= TITLE SECTION ================= */}
        <div 
          className="mb-16 bg-gradient-to-r from-[#f4f8ff] to-[#fbfcff] border border-blue-100/60 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(1,86,255,0.08)]"
          style={{ padding: '40px' }}
        >
          <h1 className="text-[42px] md:text-[54px] font-black tracking-tighter leading-tight mb-5 text-[#0b1b3d]">
            My Wishlist
          </h1>
          
          {!isEmpty && (
            <p className="text-gray-500 text-[16px] md:text-[18px] font-medium flex items-center flex-wrap gap-3">
              Bạn đang có 
              <span className="inline-flex items-center justify-center px-4 py-1.5 bg-white text-[#0156FF] rounded-xl font-bold text-lg border border-blue-100 shadow-sm">
                {products.length} sản phẩm
              </span> 
              trong danh sách yêu thích
            </p>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100" style={{ padding: '80px 20px' }}>
            <div className="relative w-36 h-36 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <div className="absolute inset-0 bg-[#0156FF] opacity-10 rounded-full animate-ping"></div>
              <ShoppingCart className="w-16 h-16 text-[#0156FF]" />
            </div>
            <h2 className="text-[26px] font-bold text-gray-800 mb-3">Danh sách yêu thích trống</h2>
            <p className="text-gray-500 mb-10 text-center max-w-md text-[16px] leading-relaxed">
              Hãy lướt xem và lưu lại những mẫu laptop bạn ưng ý nhất để không bỏ lỡ các ưu đãi nhé!
            </p>
            <Link href="/catalogs" className="px-10 py-4 rounded-full bg-[#0156FF] hover:bg-blue-800 text-white font-semibold transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1">
              Khám phá sản phẩm ngay
            </Link>
          </div>
        ) : (
          /* ================= UI CÓ SẢN PHẨM ================= */
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
            
            {/* CỘT TRÁI: BANNER QUẢNG CÁO LỚN */}
            <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0">
              <div className="relative h-full min-h-[400px] lg:min-h-[600px] rounded-[2rem] overflow-hidden group shadow-lg border border-gray-200/50">
                <img 
                  src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop" 
                  alt="Promo Banner" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: '40px' }}>
                  <span 
                    className="inline-block text-white text-[12px] font-extrabold uppercase tracking-widest shadow-lg"
                    style={{ 
                      backgroundColor: '#0156FF',
                      padding: '8px 20px', 
                      borderRadius: '999px',
                      width: 'fit-content',
                      marginBottom: '20px'
                    }}
                  >
                    Ưu đãi độc quyền
                  </span>
                  <h2 className="text-white text-4xl font-extrabold mb-5 leading-tight drop-shadow-md">
                    Nâng Tầm <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Trải Nghiệm</span>
                  </h2>
                  <p className="text-gray-300 text-[15px] mb-8 leading-relaxed">
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
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-12">
                {products.map((product) => {
                  const isSelected = selectedItems.has(product.id);
                  return (
                    <div 
                      key={product.id} 
                      className={`relative group transition-all duration-300 bg-white rounded-2xl overflow-hidden flex flex-col border shadow-sm hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'border-[#0156FF] ring-1 ring-[#0156FF]' : 'border-gray-200/80'}`}
                      style={{ padding: '30px' }} 
                    >
                      {}
                      <div className="flex justify-between items-center mb-6 z-10 relative">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="cursor-pointer w-5 h-5 rounded border-gray-300 text-[#0156FF] focus:ring-[#0156FF]"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(product.id)}
                          />
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                            <CheckCircle2 size={14} /> in stock
                          </span>
                        </div>
                        <button 
                          onClick={() => removeItem(product.id)}
                          className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {}
                      <div className="w-full h-40 mb-8 flex items-center justify-center bg-white relative rounded-xl overflow-hidden" style={{ padding: '10px' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {}
                      <div className="flex items-center gap-1.5 mb-4 text-[#fbad18] text-[12px]">
                        <span>★★★★☆</span>
                        <span className="text-gray-400 ml-1 font-medium">Đánh giá (4)</span>
                      </div>

                      {}
                      <h3 className="text-[14px] font-bold line-clamp-2 mb-6 text-gray-800 h-[46px] group-hover:text-[#0156FF] transition-colors leading-relaxed">
                        {product.name}
                      </h3>

                      {}
                      <div className="mb-8 mt-auto border-t border-dashed border-gray-200 pt-6">
                        <p className="text-gray-400 text-[13px] line-through mb-1.5 font-medium">
                          {product.oldPrice.toLocaleString("vi-VN")} ₫
                        </p>
                        <p className="text-gray-900 font-extrabold text-[18px]">
                          {product.price.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>

                      {}
                      <div className="flex gap-3 mt-auto relative z-10">
                        {}
                        <Link
                          href={`/product/${product.id}`}
                          className="flex-1 text-center font-extrabold text-gray-700 transition-colors hover:bg-gray-100 flex items-center justify-center"
                          style={{
                            fontSize: '12px',
                            padding: '8px 0',
                            borderRadius: '999px',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Chi tiết
                        </Link>

                        {}
                        <button 
                          className="flex-[1.2] font-extrabold text-white flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
                          style={{
                            fontSize: '12px',
                            padding: '8px 0',
                            borderRadius: '999px',
                            backgroundColor: '#0156FF',
                            boxShadow: '0 6px 15px -3px rgba(1, 86, 255, 0.4)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <ShoppingCart size={14} strokeWidth={2.5} /> Thêm giỏ
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* ================= THANH ACTION BAR ================= */}
              <div 
                className="mt-20 bg-white border border-gray-200 shadow-[0_12px_40px_rgb(0,0,0,0.06)] rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-8"
                style={{ padding: '30px' }}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto bg-blue-50/50 px-6 py-4 rounded-xl border border-blue-100">
                  <span className="text-[16px] font-medium text-gray-700">
                    Đã chọn: <strong className="text-[#0156FF] text-2xl ml-2">{selectedCount}</strong>
                  </span>
                </div>
                
                <div className="flex gap-5 w-full sm:w-auto">
                  <button 
                    onClick={removeSelected}
                    disabled={selectedCount === 0}
                    className="flex-1 sm:flex-none text-red-500 font-bold bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-50"
                    style={{
                      fontSize: '15px',
                      padding: '14px 32px',
                      borderRadius: '999px',
                      border: '2px solid #fee2e2',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Xóa mục chọn
                  </button>

                  <button 
                    onClick={addSelectedToCart}
                    disabled={selectedCount === 0}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    style={{
                      fontSize: '15px',
                      padding: '14px 36px',
                      borderRadius: '999px',
                      backgroundColor: selectedCount === 0 ? '#9ca3af' : '#0156FF',
                      boxShadow: selectedCount === 0 ? 'none' : '0 8px 20px -4px rgba(1, 86, 255, 0.4)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <ShoppingCart size={18} />
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