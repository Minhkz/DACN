"use client";

import React, { useState } from "react";
import style from "./CardProduct.module.css";
import Image from "next/image";
import { Rating } from "@mui/material";
import DetailProduct from "@/component/DetailProduct/DetailProduct";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { useQuery } from "@tanstack/react-query";
import { ProductReviewSummary } from "@/types/review/ProductReviewSummary";
import { Skeleton } from "antd";
import { getReviewSummary } from "@/services/review/ReviewApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToWishlist,
  createWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";

type Props = {
  product: ProductDetailDto;
};

const CardProduct = ({ product }: Props) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  if (product.sold >= product.quantity) {
    setIsAvailable(false);
  }

  const dispatch = useAppDispatch();

  const userId = useAppSelector((s) => s.auth.userId);
  const wishlistId = useAppSelector((s) => s.wishlist.wishlist?.id ?? null);

  const isLiked = useAppSelector(
    (s) =>
      s.wishlist.wishlist?.items?.some(
        (item) => item.productId === product.id,
      ) ?? false,
  );

  const isPending = useAppSelector((s) =>
    s.wishlist.pendingProductIds.includes(product.id),
  );

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId || isPending) return;

    let currentWishlistId = wishlistId;

    if (!currentWishlistId) {
      try {
        const newWishlist = await dispatch(createWishlist(userId)).unwrap();
        currentWishlistId = newWishlist.id;
      } catch (err) {
        console.error("Create wishlist failed", err);
        return;
      }
    }

    const wId = currentWishlistId!;

    if (isLiked) {
      dispatch(removeFromWishlist({ wishlistId: wId, productId: product.id }));
    } else {
      dispatch(
        addToWishlist({
          wishlistId: wId,
          productId: product.id,
          item: {
            productId: product.id,
            productName: product.name,
            avatar: product.avatar ?? "",
            price: product.price,
          },
        }),
      );
    }
  };

  const formatPrice = (value: number) => value.toLocaleString("vi-VN") + " ₫";

  const productImage =
    product.avatar && product.avatar.trim() !== ""
      ? product.avatar
      : "/product/msi-pro16.png";

  const { data, isLoading } = useQuery<ProductReviewSummary>({
    queryKey: ["reviewSummary", product.id],
    queryFn: () => getReviewSummary(product.id),
  });

  return (
    <>
      <div className={style.product} onClick={() => setOpenDetail(true)}>
        <div className={style.content}>
          <div className="warehouse">
            {isAvailable ? (
              <Image src="/img/stock.png" alt="stock" width={71} height={26} />
            ) : (
              <Image
                src="/img/check.png"
                alt="out of stock"
                width={71}
                height={26}
              />
            )}
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
            {/* ─── Heart Button ──────────────────────────── */}
            <div
              onClick={handleLike}
              style={{ width: 30, height: 30 }}
              className={`
                cursor-pointer flex items-center justify-center rounded-full
                transition-all duration-200
                ${isPending ? "opacity-40 cursor-not-allowed scale-90" : ""}
                ${
                  isLiked && !isPending
                    ? "bg-red-500 shadow-md shadow-red-500/40 scale-110"
                    : "bg-transparent scale-100"
                }
              `}
            >
              <Image
                src="/icon/heart.png"
                alt="heart"
                width={30}
                height={30}
                style={{
                  filter: isLiked ? "brightness(0) invert(1)" : "none",
                  transition: "filter 0.2s ease, transform 0.2s ease",
                }}
                className={`
                  transition-transform duration-200
                  ${isLiked ? "scale-75" : "scale-100"}
                `}
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
