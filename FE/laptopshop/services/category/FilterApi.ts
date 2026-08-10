import { clientApi } from "@/lib/axios/client";

import { ResponseResult } from "@/types/common/ResponseResult";
import { FilterDto } from "@/types/catalog/FilterDto";

export const FilterApi = {
  async getAll(): Promise<FilterDto[]> {
    const res = await clientApi.get<ResponseResult<FilterDto[]>>(
      `/filters/all`,
    );
    return res.data.data ?? [];
  },
};
