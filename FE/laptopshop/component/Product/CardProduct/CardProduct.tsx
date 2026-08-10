"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { Heart, ShoppingBag, Eye, Star, Check } from "lucide-react";

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

    if (!userId || isWishlistPending) {
      if (!userId) notify("warning", "Vui lòng đăng nhập để lưu sản phẩm yêu thích");
      return;
    }

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

    if (!userId || isCartPending || isInCart) {
      if (!userId) notify("warning", "Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

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

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const productImage =
    product.avatar && product.avatar.trim() !== ""
      ? product.avatar
      : "/product/msi-pro16.png";

  const { data: reviewData, isLoading: isReviewLoading } = useQuery<ProductReviewSummary>({
    queryKey: ["reviewSummary", product.id],
    queryFn: () => getReviewSummary(product.id),
    staleTime: 1000 * 60 * 10,
  });

  const ratingValue = reviewData?.averageRating || 5.0;
  const reviewCount = reviewData?.totalReviews || 0;

  return (
    <>
      <article
        onClick={() => setOpenDetail(true)}
        className="group relative w-full max-w-[250px] cursor-pointer rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
        style={{
          margin: "0 auto",
          padding: "12px",
          minHeight: "355px",
        }}
      >
        {/* Top Header: Stock Status & Quick Action Buttons */}
        <div
          className="flex items-center justify-between"
          style={{ margin: "0 0 8px 0", padding: "0" }}
        >
          {/* Stock status badge */}
          {isAvailable ? (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-md"
              style={{ padding: "2px 7px", margin: "0" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Sẵn hàng</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-md"
              style={{ padding: "2px 7px", margin: "0" }}
            >
              <span>Hết hàng</span>
            </span>
          )}

          {/* Quick action buttons (Wishlist & Quick View) */}
          <div
            className="flex items-center gap-1"
            style={{ margin: "0", padding: "0" }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDetail(true);
              }}
              title="Xem nhanh chi tiết"
              className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              style={{ margin: "0", padding: "0", border: "none", background: "transparent" }}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleLike}
              disabled={isWishlistPending}
              title={isLiked ? "Đã lưu vào danh sách yêu thích" : "Lưu vào yêu thích"}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                isLiked
                  ? "text-rose-600 bg-rose-50"
                  : "text-slate-400 hover:text-rose-600 hover:bg-slate-100"
              }`}
              style={{ margin: "0", padding: "0", border: "none", background: isLiked ? undefined : "transparent" }}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-600" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Product Photo Container */}
        <div
          className="relative w-full h-[145px] flex items-center justify-center rounded-xl bg-slate-50/60 overflow-hidden"
          style={{ margin: "0 0 10px 0", padding: "6px" }}
        >
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 240px"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-103"
          />
        </div>

        {/* Reviews and Ratings */}
        <div
          className="flex items-center gap-1.5 text-xs text-slate-500"
          style={{ margin: "0 0 6px 0", padding: "0" }}
        >
          {isReviewLoading ? (
            <Skeleton.Input
              active
              size="small"
              style={{ width: 80, height: 14, borderRadius: 4 }}
            />
          ) : (
            <div className="flex items-center gap-1" style={{ margin: "0", padding: "0" }}>
              <div className="flex items-center text-amber-500" style={{ margin: "0", padding: "0" }}>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-semibold text-slate-700 text-[11.5px]">
                {ratingValue.toFixed(1)}
              </span>
              <span className="text-slate-400 text-[11px]">
                ({reviewCount > 0 ? `${reviewCount} đánh giá` : "Mới"})
              </span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3
          className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#0156ff] transition-colors"
          style={{
            margin: "0 0 8px 0",
            padding: "0",
            minHeight: "34px",
          }}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price Row */}
        <div
          className="flex items-baseline justify-between"
          style={{ margin: "0 0 10px 0", padding: "0" }}
        >
          <span
            className="text-[15px] font-bold text-slate-900 tabular-nums"
            style={{ margin: "0", padding: "0" }}
          >
            {formatPrice(product.price)}
          </span>
          <span
            className="text-[10.5px] text-slate-400 font-normal"
            style={{ margin: "0", padding: "0" }}
          >
            Đã gồm VAT
          </span>
        </div>

        {/* Action: Add to Cart */}
        <button
          type="button"
          disabled={isCartPending || !isAvailable || isInCart}
          onClick={isAvailable ? handleAddToCart : undefined}
          className={`w-full flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
            isInCart
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
              : isAvailable
                ? "bg-slate-900 text-white hover:bg-[#0156ff] active:scale-98"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
          }`}
          style={{
            padding: "8px 12px",
            margin: "0",
            border: isInCart || !isAvailable ? undefined : "none",
          }}
        >
          {isCartPending ? (
            <span>Đang thêm...</span>
          ) : isInCart ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Đã thêm vào giỏ</span>
            </>
          ) : !isAvailable ? (
            <span>Hết hàng</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </article>

      {/* Product Detail Modal */}
      <DetailProduct
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        id={product.id}
      />
    </>
  );
};

export default React.memo(CardProduct);
