"use client";
import style from "./Item.module.css";
import Image from "next/image";
import { Heart, BarChart2, Mail } from "lucide-react";
import { Rating } from "@mui/material";

const Item = () => {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition mb-4 min-h-[330px]">
      {/* In Stock */}
      <div className="absolute top-3 right-4 lg:top-4 lg:right-6">
        <Image src="/img/stock.png" alt="stock" width={71} height={26} />
      </div>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="flex justify-center">
          <Image
            src="/product/msi-white.png"
            alt="product"
            width={200}
            height={250}
          />
        </div>

        <div>
          <p className="text-xs text-gray-400">SKU D5515AI</p>

          <h3 className="font-semibold text-gray-900 leading-snug">
            EX DISPLAY : MSI Pro 16 Flex-036AU 15.6 MULTITOUCH...
          </h3>

          <div className="flex items-center gap-3 mt-2">
            <span className="line-through text-gray-400 text-sm">
              19.990.000 ₫
            </span>
            <span className="text-lg font-bold text-black">17.990.000 ₫</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Rating defaultValue={4} precision={0.5} readOnly size="small" />
          <span className="text-sm">Đánh giá (4)</span>
        </div>

        <button className={`${style.addCart} flex items-center gap-2`}>
          <Image src="/icon/cart-blue.png" alt="cart" width={18} height={18} />
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block">
        {/* Image */}
        <div className="absolute top-6 left-8 w-[220px]">
          <Image
            src="/product/msi-white.png"
            alt="product"
            width={200}
            height={250}
          />
        </div>

        {/* Info */}
        <div className="absolute top-12 left-[260px] w-[420px]">
          <p className="text-xs text-gray-400">SKU D5515AI</p>

          <h3 className="font-semibold text-gray-900 leading-snug mt-1">
            EX DISPLAY : MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-On...
          </h3>

          <div className="flex items-center gap-3 mt-3">
            <span className="line-through text-gray-400 text-sm">
              19.990.000 ₫
            </span>
            <span className="text-xl font-bold text-black">17.990.000 ₫</span>
          </div>
        </div>

        {/* Specs */}
        <div className="absolute top-20 right-32 w-[220px] text-sm text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span>CPU</span>
            <span>N/A</span>
          </div>

          <div className="flex justify-between bg-gray-100 px-2 py-1 rounded">
            <span>Featured</span>
            <span>N/A</span>
          </div>

          <div className="flex justify-between">
            <span>I/O Ports</span>
            <span>N/A</span>
          </div>
        </div>

        {/* Rating */}
        <div className="absolute bottom-10 left-8 flex items-center gap-2">
          <Rating defaultValue={4} precision={0.5} readOnly />
          <span>Đánh giá (4)</span>
        </div>

        {/* Add Cart */}
        <div className={`absolute bottom-10 left-[260px] ${style.addCart}`}>
          <Image src="/icon/cart-blue.png" alt="cart" width={20} height={20} />
          <span>Thêm vào giỏ hàng</span>
        </div>

        {/* Action Icons */}
        <div className="absolute bottom-8 right-8 flex gap-4 text-gray-400">
          <Mail className="cursor-pointer hover:text-black" size={26} />
          <BarChart2 className="cursor-pointer hover:text-black" size={26} />
          <Heart className="cursor-pointer hover:text-black" size={26} />
        </div>
      </div>
    </div>
  );
};

export default Item;
