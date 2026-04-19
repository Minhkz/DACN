import { clientApi } from "@/lib/axios/client";
import { ResponseResult } from "@/types/common/ResponseResult";
import { ProductReviewSummary } from "@/types/review/ProductReviewSummary";
import { ReviewDto } from "@/types/review/ReviewDto";
import { ReviewRequest } from "@/types/review/ReviewRequest";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ReviewApi = {
  async getByProduct(productId: number): Promise<ReviewDto[]> {
    const res = await axios.get<ResponseResult<ReviewDto[]>>(
      `${BASE_URL}/products/${productId}/reviews`,
    );

    return res.data.data ?? [];
  },

  async getSummary(productId: number): Promise<ProductReviewSummary | null> {
    const res = await axios.get<ResponseResult<ProductReviewSummary>>(
      `${BASE_URL}/products/${productId}/reviews/summary`,
    );

    return res.data.data ?? null;
  },

  async create(payload: ReviewRequest): Promise<ReviewDto> {
    const res = await clientApi.post<ResponseResult<ReviewDto>>(
      `/products/${payload.productId}/reviews`,
      payload,
    );

    return res.data.data;
  },

  async update(id: number, payload: ReviewRequest): Promise<ReviewDto> {
    const res = await clientApi.put<ResponseResult<ReviewDto>>(
      `/reviews/${id}`,
      payload,
    );

    return res.data.data;
  },

  async delete(id: number): Promise<string> {
    const res = await clientApi.delete<ResponseResult<string>>(
      `/reviews/${id}`,
    );

    return res.data.data;
  },
};

const getReviewSummary = async (
  productId: number,
): Promise<ProductReviewSummary> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews/summary`,
  );
  return res.data.data;
};

export { ReviewApi, getReviewSummary };
