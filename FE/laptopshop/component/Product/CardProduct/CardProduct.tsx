"use client";

import React, { useState } from "react";
import style from "./CardProduct.module.css";
import Image from "next/image";
import { Rating } from "@mui/material";
import DetailProduct from "@/component/DetailProduct/DetailProduct";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { getReviewSummary } from "@/services/review/ReviewApi,";
import { useQuery } from "@tanstack/react-query";
import { ProductReviewSummary } from "@/types/review/ProductReviewSummary";
import { Skeleton } from "antd";

type Props = {
  product: ProductDetailDto;
};

const CardProduct = ({ product }: Props) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN") + " ₫";
  };

  const productImage =
    product.avatar && product.avatar.trim() !== ""
      ? product.avatar
      : "/product/msi-pro16.png";

  const { data, isLoading, error, isError } = useQuery<ProductReviewSummary>({
    queryKey: ["reviewSummary", product.id],
    queryFn: () => getReviewSummary(product.id),
  });

  return (
    <>
      <div className={style.product} onClick={() => setOpenDetail(true)}>
        <div className={style.content}>
          <div className="warehouse">
            <Image src="/img/stock.png" alt="stock" width={71} height={26} />
          </div>

          <div className="product--img">
            <Image
              src={productImage}
              alt={product.name}
              width={150}
              height={150}
            />
          </div>

          <div className="product--reviews flex gap-1 flex-center items-center">
            {isLoading ? (
              <Skeleton.Input
                active
                size="small"
                style={{ width: 120, height: 16, borderRadius: 6 }}
              />
            ) : (
              <>
                <div className="star">
                  <Rating
                    name="half-rating"
                    value={data?.averageRating || 0}
                    precision={0.5}
                    readOnly
                  />
                </div>
                <div className={style.review}>
                  <span>({data?.totalReviews || 0})</span>
                </div>
              </>
            )}
          </div>

          <div className={style.info}>
            <div className="name">{product.name}</div>

            <div className="price">
              <div className={style.oldPrice}>
                {formatPrice(product.price * 1.2)}
              </div>
              <div className="currentPrice">{formatPrice(product.price)}</div>
            </div>
          </div>

          <div className={style.icon}>
            <div
              className={`cursor-pointer flex items-center justify-center rounded-full transition-all duration-300 ${
                isLiked
                  ? "bg-red-500 shadow-md shadow-red-500/40 scale-110"
                  : "bg-transparent scale-100"
              }`}
              style={{ width: 30, height: 30 }}
              onClick={handleLike}
            >
              <Image
                src="/icon/heart.png"
                alt="heart"
                width={30}
                height={30}
                style={{
                  filter: isLiked ? "brightness(0) invert(1)" : "none",
                  transition: "all 0.3s ease",
                }}
                className={`${
                  isLiked ? "scale-75" : "scale-100"
                } transition-transform duration-300`}
              />
            </div>

            <div>
              <Image
                src="/icon/compare.png"
                alt="compare"
                width={30}
                height={30}
              />
            </div>
          </div>

          <div className={style.addCart}>
            <Image
              src="/icon/cart-blue.png"
              alt="cart"
              width={18}
              height={18}
              className={style.cartIcon}
            />
            <span>Thêm vào giỏ</span>
          </div>
        </div>
      </div>

      <DetailProduct
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        id={product.id}
      />
    </>
  );
};

export default CardProduct;
