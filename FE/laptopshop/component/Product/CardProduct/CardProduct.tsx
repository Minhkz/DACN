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
          bg-white border border-gray-100
          transition-all duration-300 ease-out
          hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)]
        "
      >
        <div
          className="relative flex min-h-[390px] flex-col"
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

          {/* Action icons */}
          <div
            className="
              absolute top-4 right-3 z-20 flex flex-col gap-2
              opacity-0 translate-x-3 pointer-events-none
              transition-all duration-300 ease-out
              group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto
            "
          >
            {/* Heart Button */}
            <div
              onClick={handleLike}
              className={`
                flex h-[34px] w-[34px] items-center justify-center rounded-full
                border border-gray-100 bg-white/95 shadow-sm backdrop-blur
                transition-all duration-200
                hover:scale-110 hover:shadow-md
                ${isWishlistPending ? "opacity-40 cursor-not-allowed scale-90" : ""}
                ${
                  isLiked && !isWishlistPending
                    ? "bg-red-500 border-red-500 shadow-red-500/30 scale-110"
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
                  transition-transform duration-200
                  ${isLiked ? "scale-80" : "scale-100"}
                `}
              />
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="
                flex h-[34px] w-[34px] items-center justify-center rounded-full
                border border-gray-100 bg-white/95 shadow-sm backdrop-blur
                transition-all duration-200 hover:scale-110 hover:shadow-md
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
              flex items-center justify-center
              transition-transform duration-300
              group-hover:scale-[1.03]
            "
            style={{ marginTop: 12, marginBottom: 12 }}
          >
            <Image
              src={productImage}
              alt={product.name}
              width={155}
              height={155}
              className="h-[155px] w-[155px] object-contain"
            />
          </div>

          {/* Reviews */}
          <div className="flex items-center gap-1" style={{ marginBottom: 10 }}>
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
                />

                <span className="text-xs font-normal leading-none text-gray-400">
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
                text-sm font-medium leading-[21px] text-gray-800
                transition-colors duration-200
                group-hover:text-[#0156ff]
              "
              style={{ marginBottom: 10 }}
            >
              {product.name}
            </h3>

            <div style={{ marginBottom: 14 }}>
              <div className="text-sm text-gray-400 line-through">
                {formatPrice(product.price * 1.2)}
              </div>

              <div className="text-lg font-bold text-gray-950">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              disabled={isCartPending || !isAvailable || isInCart}
              onClick={isAvailable ? handleAddToCart : undefined}
              className={`
                mt-auto flex h-11 w-full items-center justify-center gap-2
                rounded-full border text-[13px] font-semibold tracking-wide
                transition-all duration-300 ease-out
                opacity-0 translate-y-5 pointer-events-none
                group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto

                ${
                  isInCart
                    ? "border-[#0156ff] bg-[#0156ff] text-white cursor-default"
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
