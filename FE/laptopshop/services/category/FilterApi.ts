import axios from "axios";

import { ResponseResult } from "@/types/common/ResponseResult";
import { FilterDto } from "@/types/catalog/FilterDto";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const FilterApi = {
  async getAll(): Promise<FilterDto[]> {
    const res = await axios.get<ResponseResult<FilterDto[]>>(
      `${BASE_URL}/filters/all`,
    );
    return res.data.data ?? [];
  },
};
