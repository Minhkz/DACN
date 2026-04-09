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
             
             <div className="cursor-pointer" onClick={handleLike}>
              <Image src="/icon/heart.png" alt="logo" width={30} height={30} style={{
                  // Mã Hex #ff0000 (Đỏ) được tạo ra từ filter này
                  filter: isLiked ? "invert(24%) sepia(99%) saturate(7404%) hue-rotate(355deg) brightness(97%) contrast(114%)" : "none",
                  transition: "filter 0.3s ease"
                }}/>
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
