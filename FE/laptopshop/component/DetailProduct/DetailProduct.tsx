"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import AboutProduct from "./About/AboutProduct";
import DetailList from "./Detail/DetailList";
import SpecProduct from "./Specs/SpecProduct";
import { Minus, Plus } from "lucide-react";

type TabType = "about" | "details" | "specs";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DetailProduct = ({ open, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [activePreview, setActivePreview] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Lock scroll body khi mở modal
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Đóng bằng ESC
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const product = {
    id: 1,
    title: "Logitech MX Master 3S Wireless Mouse",
    price: 120,
    discountedPrice: 95,
    description: "High-performance wireless mouse with ultra-fast scrolling.",
    imgs: {
      thumbnails: ["/product/msi-pro16.png", "/product/msi-white.png"],
      previews: ["/product/msi-pro16.png", "/product/msi-white.png"],
    },
  };

  const modalUI = (
    <div
      className="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-300 bg-white rounded-xl shadow-2xl p-8 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
        >
          ✕
        </button>
        <div className="content flex gap-4" style={{ padding: "20px" }}>
          <div className="max-w-[450px] w-full ">
            <div className="flex gap-5">
              <div className="flex flex-col gap-5">
                {product.imgs.thumbnails?.map((img, key) => (
                  <button
                    onClick={() => setActivePreview(key)}
                    key={key}
                    className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-gray-1 ease-out duration-200 hover:border-2 hover:border-blue ${
                      activePreview === key && "border-2 border-blue"
                    }`}
                  >
                    <Image
                      src={img || ""}
                      alt="thumbnail"
                      width={61}
                      height={61}
                      className="aspect-square"
                    />
                  </button>
                ))}
              </div>

              <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-gray-1 rounded-lg">
                <div>
                  {product?.imgs?.previews?.[activePreview] && (
                    <Image
                      src={product.imgs.previews[activePreview]}
                      alt="products-details"
                      width={150}
                      height={150}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="information relative">
            <div className="flex gap-8">
              {["about", "details", "specs"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabType)}
                  className={`relative pb-3 text-sm font-medium transition-all
                      ${
                        activeTab === tab
                          ? "text-black after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-600"
                          : "text-gray-500 hover:text-black"
                      }`}
                  style={{ marginBottom: "25px" }}
                >
                  {tab === "about" && "About Product"}
                  {tab === "details" && "Details"}
                  {tab === "specs" && "Specs"}
                </button>
              ))}
            </div>
            <div className="infor">
              <h1
                className="text-[32px] font-bold"
                style={{ marginBottom: "40px" }}
              >
                MSI MPG Trident 3
              </h1>
              {activeTab === "about" && (
                <AboutProduct desc="MSI MPG Trident 3 10SC-005AU Intel i7 10700F, 2060 SUPER, 16GB RAM, 512GB SSD, 2TB HDD, Windows 10 Home, Gaming Keyboard and Mouse 3 Years Warranty Gaming Desktop" />
              )}
              {activeTab === "details" && (
                <DetailList
                  items={[
                    "Intel Core i7-10700F",
                    "Intel H410",
                    "WHITE",
                    "NVIDIA MSI GeForce RTX 2060 SUPER 8GB AERO ITX GDDR6",
                  ]}
                />
              )}
              {activeTab === "specs" && <SpecProduct />}
              <div className="flex items-center gap-6 bg-white p-6 absolute bottom-10 left-0">
                {/* Price */}
                <div className="text-2xl font-semibold text-black">
                  $3,299.00
                </div>

                {/* Quantity */}
                <div className="flex justify-around items-center gap-4 bg-gray-100 rounded-xl overflow-hidden">
                  {/* Minus */}
                  <button
                    onClick={decrease}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-200 transition"
                  >
                    <Minus size={18} />
                  </button>

                  {/* Quantity */}
                  <div className="px-6 py-3 font-medium text-lg select-none">
                    {quantity}
                  </div>

                  {/* Plus */}
                  <button
                    onClick={increase}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-200 transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 rounded-full text-lg transition-all w-[151px] h-[50px]">
                  Add to Cart
                </button>

                {/* PayPal */}
                <button className="bg-yellow-400 hover:bg-yellow-500 px-12 py-4 rounded-full flex items-center justify-center text-lg font-semibold w-[140px] h-[50px] transition-all">
                  <Image
                    src="/logo/pay.png"
                    alt="PayPal"
                    width={72}
                    height={18}
                    className="object-contain"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalUI, document.body);
};

export default DetailProduct;
