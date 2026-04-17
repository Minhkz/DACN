import { clientApi } from "@/lib/axios/client";
import { ReviewRequest } from "./../../types/review/ReviewRequest";
import { ProductReviewSummary } from "@/types/review/ProductReviewSummary";
import { ReviewDto } from "@/types/review/ReviewDto";
import axios from "axios";

const getReviewSummary = async (
  productId: number,
): Promise<ProductReviewSummary> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/reviews/summary/${productId}`,
  );
  return res.data.data;
};

const getReviewsByProductId = async (
  productId: number,
): Promise<ReviewDto[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/reviews/product/${productId}`,
  );
  return res.data.data;
};
const create = async (request: ReviewRequest): Promise<ReviewDto> => {
  const res = await clientApi.post(
    `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
    request,
  );
  return res.data.data;
};

export { getReviewSummary, getReviewsByProductId, create };
