"use client";

import React, { useState } from "react";
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
import { addToCart, createCart } from "@/store/slices/cartSlice";
import { notify } from "@/utils/notify";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

type Props = {
  product: ProductDetailDto;
};

const CardProduct = ({ product }: Props) => {
  const [openDetail, setOpenDetail] = useState(false);
  const isAvailable = product.sold < product.quantity;

  const dispatch = useAppDispatch();

  const userId = useAppSelector((s) => s.auth.userId);

  // ─── Wishlist selectors ────────────────────────────────────────────────────
  const wishlistId = useAppSelector((s) => s.wishlist.wishlist?.id ?? null);

  const isLiked = useAppSelector(
    (s) =>
      s.wishlist.wishlist?.items?.some(
        (item) => item.productId === product.id,
      ) ?? false,
  );

  const isWishlistPending = useAppSelector((s) =>
    s.wishlist.pendingProductIds.includes(product.id),
  );

  // ─── Cart selectors ────────────────────────────────────────────────────────
  const cartId = useAppSelector((s) => s.cart.cart?.id ?? null);

  const isInCart = useAppSelector(
    (s) =>
      s.cart.cart?.items?.some((item) => item.productId === product.id) ??
      false,
  );

  const isCartPending = useAppSelector((s) =>
    s.cart.pendingProductIds.includes(product.id),
  );

  // ─── Wishlist handler ──────────────────────────────────────────────────────
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId || isWishlistPending) return;

    if (!wishlistId) {
      try {
        await dispatch(createWishlist()).unwrap();
      } catch (error) {
        const message = getAxiosErrorMessage(error);
        notify("error", message);
        return;
      }
    }

    if (isLiked) {
      dispatch(removeFromWishlist({ productId: product.id }));
    } else {
      dispatch(
        addToWishlist({
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

  // ─── Cart handler ──────────────────────────────────────────────────────────
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId || isCartPending || isInCart) return;

    if (!cartId) {
      try {
        await dispatch(createCart()).unwrap();
      } catch (error) {
        const message = getAxiosErrorMessage(error);
        notify("error", message);
        return;
      }
    }

    dispatch(
      addToCart({
        productId: product.id,
        quantity: 1,
        item: {
          productId: product.id,
          productName: product.name,
          avatar: product.avatar ?? "",
          price: product.price,
          qty: 1,
        },
      }),
    );
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
      <div
        onClick={() => setOpenDetail(true)}
        className="
          group relative w-[234px] cursor-pointer overflow-hidden rounded-2xl
          bg-white border border-slate-100/80
          transition-all duration-500 ease-out
          hover:-translate-y-2 hover:border-blue-200/60
          hover:shadow-[0_20px_40px_-15px_rgba(1,86,255,0.12)]
        "
      >
        <div
          className="relative flex min-h-[396px] flex-col"
          style={{
            paddingLeft: 18,
            paddingRight: 18,
            paddingTop: 14,
            paddingBottom: 14,
          }}
        >
          {/* Stock status */}
          <div className="flex items-center justify-between">
            {isAvailable ? (
              <div className="transition-transform duration-300 hover:scale-105">
                <Image
                  src="/img/stock.png"
                  alt="stock"
                  width={71}
                  height={26}
                />
              </div>
            ) : (
              <div className="transition-transform duration-300 hover:scale-105">
                <Image
                  src="/img/check.png"
                  alt="out of stock"
                  width={71}
                  height={26}
                />
              </div>
            )}
          </div>

          {/* Action icons */}
          <div
            className="
              absolute top-3 right-3 z-20 flex flex-col gap-2
              opacity-0 scale-90 pointer-events-none
              transition-all duration-300 ease-out
              group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
            "
          >
            {/* Heart Button */}
            <div
              onClick={handleLike}
              className={`
                flex h-[34px] w-[34px] items-center justify-center rounded-full
                border border-slate-100 bg-white/90 shadow-sm backdrop-blur-md
                transition-all duration-300 cursor-pointer
                hover:scale-110 hover:shadow-md active:scale-95
                ${isWishlistPending ? "opacity-40 cursor-not-allowed scale-90" : ""}
                ${
                  isLiked && !isWishlistPending
                    ? "bg-gradient-to-br from-rose-500 to-red-600 border-none shadow-[0_6px_14px_rgba(244,63,94,0.35)] scale-110"
                    : ""
                }
              `}
            >
              <Image
                src="/icon/heart.png"
                alt="heart"
                width={22}
                height={22}
                style={{
                  filter: isLiked ? "brightness(0) invert(1)" : "none",
                  transition: "filter 0.2s ease, transform 0.2s ease",
                }}
                className={`
                  transition-transform duration-300
                  ${isLiked ? "scale-90" : "scale-100"}
                `}
              />
            </div>

            {/* Compare Button */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="
                flex h-[34px] w-[34px] items-center justify-center rounded-full
                border border-slate-100 bg-white/90 shadow-sm backdrop-blur-md
                transition-all duration-300 cursor-pointer
                hover:scale-110 hover:shadow-md active:scale-95
              "
            >
              <Image
                src="/icon/compare.png"
                alt="compare"
                width={22}
                height={22}
              />
            </div>
          </div>

          {/* Product image */}
          <div
            className="
              relative flex items-center justify-center
              transition-all duration-500 ease-out
              group-hover:scale-[1.06] group-hover:-translate-y-1
            "
            style={{ marginTop: 12, marginBottom: 12 }}
          >
            {/* Radial glow backdrop */}
            <div className="absolute w-[140px] h-[140px] bg-[radial-gradient(circle_at_center,rgba(1,86,255,0.06)_0%,transparent_70%)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <Image
              src={productImage}
              alt={product.name}
              width={155}
              height={155}
              className="h-[155px] w-[155px] object-contain z-10"
            />
          </div>

          {/* Reviews */}
          <div
            className="flex items-center gap-1.5"
            style={{ marginBottom: 10 }}
          >
            {isLoading ? (
              <Skeleton.Input
                active
                size="small"
                style={{ width: 120, height: 16, borderRadius: 6 }}
              />
            ) : (
              <>
                <Rating
                  name="half-rating"
                  value={data?.averageRating || 0}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#ffb800",
                    },
                    "& .MuiRating-iconEmpty": {
                      color: "#e2e8f0",
                    },
                  }}
                />

                <span className="text-xs font-normal leading-none text-slate-400">
                  ({data?.totalReviews || 0})
                </span>
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col">
            <h3
              className="
                line-clamp-2 min-h-[42px]
                text-sm font-semibold leading-[21px] text-slate-800
                transition-colors duration-300
                group-hover:text-[#0156ff]
              "
              style={{ marginBottom: 8 }}
            >
              {product.name}
            </h3>

            {/* Price display with discount badge */}
            <div style={{ marginBottom: 14 }} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price * 1.2)}
                </span>
                <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  -20%
                </span>
              </div>

              <div className="text-[19px] font-extrabold text-slate-900 tracking-tight">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              disabled={isCartPending || !isAvailable || isInCart}
              onClick={isAvailable ? handleAddToCart : undefined}
              className={`
                mt-auto flex h-[42px] w-full items-center justify-center gap-2
                rounded-full border text-[13px] font-bold tracking-wide
                transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
                opacity-0 translate-y-3 pointer-events-none
                group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto

                ${
                  isInCart
                    ? "border-[#0156ff] bg-[#0156ff] text-white cursor-default shadow-[0_4px_12px_rgba(1,86,255,0.15)]"
                    : "border-[#0156ff] bg-[#0156ff]/5 text-[#0156ff] hover:bg-[#0156ff] hover:text-white hover:shadow-[0_8px_22px_rgba(1,86,255,0.25)]"
                }

                ${
                  isCartPending || !isAvailable
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : ""
                }
              `}
              style={{ marginBottom: 2 }}
            >
              {isCartPending ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <Image
                  src="/icon/cart-blue.png"
                  alt="cart"
                  width={18}
                  height={18}
                  className={`
                    transition-all duration-300
                    ${isInCart ? "brightness-0 invert" : "group-hover:brightness-0 group-hover:invert"}
                  `}
                />
              )}

              <span>
                {isCartPending
                  ? "Đang thêm..."
                  : isInCart
                    ? "Đã trong giỏ"
                    : !isAvailable
                      ? "Hết hàng"
                      : "Thêm vào giỏ"}
              </span>
            </button>
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
