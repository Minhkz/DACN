import React, { useEffect, useState } from "react";
import axios from "axios";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import reviewStyles from "./ProductReview.module.css";

type Review = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
};

type RatingSummary = {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

type ProductReviewProps = {
  productId: number;
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

export default function ProductReview({ productId }: ProductReviewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`,
        );

        setReviews(res.data.data?.reviews ?? []);
        setSummary(res.data.data?.summary ?? null);
      } catch (error) {
        console.error("Lỗi lấy review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) return;

    try {
      setSubmitting(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`,
        {
          rating,
          comment,
        },
      );

      const newReview = res.data.data;

      setReviews((prev) => [newReview, ...prev]);

      setSummary((prev) => {
        if (!prev) {
          return {
            average: rating,
            total: 1,
            distribution: {
              1: rating === 1 ? 1 : 0,
              2: rating === 2 ? 1 : 0,
              3: rating === 3 ? 1 : 0,
              4: rating === 4 ? 1 : 0,
              5: rating === 5 ? 1 : 0,
            },
          };
        }

        const newTotal = prev.total + 1;
        const newDistribution = {
          ...prev.distribution,
          [rating]: prev.distribution[rating as 1 | 2 | 3 | 4 | 5] + 1,
        };

        const totalScore = prev.average * prev.total + rating;

        return {
          average: totalScore / newTotal,
          total: newTotal,
          distribution: newDistribution,
        };
      });

      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Lỗi gửi review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const barPercent = (star: 1 | 2 | 3 | 4 | 5): number => {
    if (!summary || summary.total === 0) return 0;
    return Math.round((summary.distribution[star] / summary.total) * 100);
  };

  return (
    <div className={reviewStyles.wrap}>
      {summary && (
        <div className={reviewStyles.summary}>
          <div>
            <div className={reviewStyles.bigScore}>
              {summary.average.toFixed(1)}
            </div>
            <StarDisplay rating={Math.round(summary.average)} />
            <div className={reviewStyles.totalCount}>
              {summary.total} đánh giá
            </div>
          </div>

          <div className={reviewStyles.bars}>
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <div key={star} className={reviewStyles.barRow}>
                <span className={reviewStyles.barLabel}>{star}</span>
                <div className={reviewStyles.barTrack}>
                  <div
                    className={reviewStyles.barFill}
                    style={{ width: `${barPercent(star)}%` }}
                  />
                </div>
                <span className={reviewStyles.barCount}>
                  {summary.distribution[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={reviewStyles.form}>
        <p className={reviewStyles.formTitle}>Viết đánh giá của bạn</p>

        <StarSelector value={rating} onChange={setRating} />

        <textarea
          className={reviewStyles.textarea}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className={reviewStyles.submit}
          onClick={handleSubmit}
          disabled={rating === 0 || !comment.trim() || submitting}
        >
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>

      <p className={reviewStyles.listTitle}>Đánh giá từ khách hàng</p>

      {loading ? (
        <div className={reviewStyles.empty}>Đang tải đánh giá...</div>
      ) : reviews.length === 0 ? (
        <div className={reviewStyles.empty}>
          Chưa có đánh giá nào. Hãy là người đầu tiên!
        </div>
      ) : (
        reviews.map((rv) => (
          <div key={rv.id} className={reviewStyles.item}>
            <div className={reviewStyles.itemHeader}>
              <div className={reviewStyles.avatar}>{rv.avatar}</div>
              <div className={reviewStyles.itemInfo}>
                <p className={reviewStyles.itemName}>{rv.name}</p>
                <div className={reviewStyles.itemStars}>
                  <StarDisplay rating={rv.rating} />
                </div>
              </div>
              <span className={reviewStyles.itemDate}>{rv.date}</span>
            </div>
            <p className={reviewStyles.comment}>{rv.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}
