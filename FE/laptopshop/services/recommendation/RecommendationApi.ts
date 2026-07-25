import { clientApi } from "@/lib/axios/client";
import { ResponseResult } from "@/types/common/ResponseResult";
import { RecommendationData } from "@/types/recommendation/recommendation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const recommendationApi = {
  getRecommendations: async (
    productId: number,
  ): Promise<ResponseResult<RecommendationData>> => {
    const { data } = await clientApi.get<ResponseResult<RecommendationData>>(
      `${BASE_URL}/products/${productId}/recommendations`,
    );
    return data;
  },
};
