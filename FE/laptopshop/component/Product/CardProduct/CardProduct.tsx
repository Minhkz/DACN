"use client";
import ProductType from "@/types/product/ProductType";
import React, { useState } from "react";
import style from "./CardProduct.module.css";
import Image from "next/image";
import { Rating } from "@mui/material";
import DetailProduct from "@/component/DetailProduct/DetailProduct";

const CardProduct = () => {
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <>
      <div className={style.product} onClick={() => setOpenDetail(true)}>
        <div className={style.content}>
          <div className="warehouse">
            <Image src="/img/stock.png" alt="logo" width={71} height={26} />
          </div>
          <div className="product--img">
            <Image
              src="/product/msi-pro16.png"
              alt="logo"
              width={150}
              height={150}
            />
          </div>
          <div className="product--reviews flex gap-1 flex-center items-center">
            <div className="star">
              <Rating
                name="half-rating"
                defaultValue={4}
                precision={0.5}
                readOnly
              />
            </div>
            <div className={style.review}>
              <span>Đánh giá(4)</span>
            </div>
          </div>
          <div className={style.info}>
            <div className="name">
              EX DISPLAY : MSI Pro 16 Flex-036AU 15.6 MULTITOUCH All-In-On...
            </div>
            <div className="price">
              <div className={style.oldPrice}>19.990.000 ₫</div>
              <div className="currentPrice">17.990.000 ₫</div>
            </div>
          </div>
          <div className={style.icon}>
            
            {/* Nút thả tim (Đã thêm thủ thuật nền đỏ - tim trắng) */}
            <div 
              className={`cursor-pointer flex items-center justify-center rounded-full transition-all duration-300 ${
                isLiked ? "bg-red-500 shadow-md shadow-red-500/40 scale-110" : "bg-transparent scale-100"
              }`}
              style={{ width: 30, height: 30 }}
              onClick={handleLike}
            >
              <Image 
                src="/icon/heart.png" 
                alt="logo" 
                width={30} 
                height={30} 
                style={{
                
                  filter: isLiked ? "brightness(0) invert(1)" : "none",
                  transition: "all 0.3s ease"
                }}
                className={`${isLiked ? "scale-75" : "scale-100"} transition-transform duration-300`}
              />
            </div>

            
            <div className="">
              <Image
                src="/icon/compare.png"
                alt="logo"
                width={30}
                height={30}
              />
            </div>

          </div>
          <div className={style.addCart}>
            <Image
              src="/icon/cart-blue.png"
              alt="logo"
              width={20}
              height={20}
            />
            <span>Thêm vào giỏ hàng</span>
          </div>
        </div>
      </div>
      <DetailProduct open={openDetail} onClose={() => setOpenDetail(false)} />
    </>
  );
};

export default CardProduct;
