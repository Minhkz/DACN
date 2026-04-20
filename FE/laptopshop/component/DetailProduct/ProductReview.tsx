"use client";

import React, { useState } from "react";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import reviewStyles from "./ProductReview.module.css";
import { ReviewDto } from "@/types/review/ReviewDto";
import { ProductReviewSummary } from "@/types/review/ProductReviewSummary";
import { ReviewApi } from "@/services/review/ReviewApi";
import { Spin } from "antd";

type ProductReviewProps = {
  productId: number;
  userId: number;
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className={reviewStyles.starsDisplay}>
      {[1, 2, 3, 4, 5].map((s) =>
        s <= rating ? (
          <StarFilled key={s} style={{ color: "#fadb14", fontSize: 16 }} />
        ) : (
          <StarOutlined key={s} style={{ color: "#d1d5db", fontSize: 16 }} />
        ),
      )}
    </div>
  );
}

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={reviewStyles.starSelect}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className={`${reviewStyles.starButton} ${
            s <= (hovered || value) ? reviewStyles.starButtonActive : ""
          }`}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductReview({
  productId,
  userId,
}: ProductReviewProps) {
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");

  const [reviewsQuery, summaryQuery] = useQueries({
    queries: [
      {
        queryKey: ["reviews", productId],
        queryFn: () => ReviewApi.getByProduct(productId),
        enabled: !!productId,
      },
      {
        queryKey: ["review-summary", productId],
        queryFn: () => ReviewApi.getSummary(productId),
        enabled: !!productId,
      },
    ],
  });

  const reviews: ReviewDto[] = reviewsQuery.data ?? [];
  const summary: ProductReviewSummary | null = summaryQuery.data ?? null;
  const loading = reviewsQuery.isLoading || summaryQuery.isLoading;

  const createReviewMutation = useMutation({
    mutationFn: ReviewApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({
        queryKey: ["reviewSummary", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["review-summary", productId],
      });
    },
  });

  const handleSubmit = async () => {
    if (rating === 0 || !reviewContent.trim()) return;

    try {
      await createReviewMutation.mutateAsync({
        productId,
        userId,
        rating,
        reviewContent: reviewContent.trim(),
      });

      setRating(0);
      setReviewContent("");
    } catch (error) {
      console.error("Lỗi gửi review:", error);
    }
  };

  if (reviewsQuery.isFetching || summaryQuery.isFetching) {
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );
  }

  return (
    <div className={reviewStyles.wrap}>
      {summary && (
        <div className={reviewStyles.summary}>
          <div>
            <div className={reviewStyles.bigScore}>
              {summary.averageRating.toFixed(1)}
            </div>
            <StarDisplay rating={Math.round(summary.averageRating)} />
            <div className={reviewStyles.totalCount}>
              {summary.totalReviews} đánh giá
            </div>
          </div>
        </div>
      )}

      <div className={reviewStyles.form}>
        <p className={reviewStyles.formTitle}>Viết đánh giá của bạn</p>

        <StarSelector value={rating} onChange={setRating} />

        <textarea
          className={reviewStyles.textarea}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
        />

        <button
          className={reviewStyles.submit}
          onClick={handleSubmit}
          disabled={
            rating === 0 ||
            !reviewContent.trim() ||
            createReviewMutation.isPending
          }
        >
          {createReviewMutation.isPending ? (
            <Spin size="small" style={{ color: "#fff" }} />
          ) : (
            "Gửi đánh giá"
          )}
        </button>
      </div>

      <p className={reviewStyles.listTitle}>Đánh giá từ khách hàng</p>

      {loading ? (
        <div className={reviewStyles.empty}>
          <Spin size="medium" />
        </div>
      ) : reviews.length === 0 ? (
        <div className={reviewStyles.empty}>
          Chưa có đánh giá nào. Hãy là người đầu tiên!
        </div>
      ) : (
        reviews.map((rv) => (
          <div key={rv.id} className={reviewStyles.item}>
            <div className={reviewStyles.itemHeader}>
              {/* Avatar + tên người dùng */}
              <div className={reviewStyles.itemUser}>
                {rv.user?.avatar && (
                  <img
                    src={rv.user.avatar}
                    alt={rv.user.fullName}
                    className={reviewStyles.avatar}
                  />
                )}
                <span className={reviewStyles.fullName}>
                  {rv.user?.fullName ?? rv.user?.username}
                </span>
              </div>

              <div className={reviewStyles.itemInfo}>
                <StarDisplay rating={rv.rating} />
                <span className={reviewStyles.itemDate}>
                  {new Date(rv.createdDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            {/* Nội dung review — API trả về "reviewContent", không phải "comment" */}
            <p className={reviewStyles.comment}>{rv.reviewContent}</p>
          </div>
        ))
      )}
    </div>
  );
}
