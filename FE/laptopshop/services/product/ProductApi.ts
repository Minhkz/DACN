import { ProductFilterValue } from "@/types/catalog/FilterDto";
import { ResponseResult } from "@/types/common/ResponseResult";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { ProductFilterRequest } from "@/types/product/ProductFilterRequest";
import { ProductPageDto } from "@/types/product/ProductPageDto";
import axios from "axios";

const buildProductFilterRequest = (
  value: ProductFilterValue,
  page: number,
  size: number,
  extraFilters: Record<string, number[]> = {},
): ProductFilterRequest => {
  const selectedFilters = Object.fromEntries(
    Object.entries(value.selected).filter(([, ids]) => ids.length > 0),
  );

  return {
    price: {
      min: value.minPrice ?? null,
      max: value.maxPrice ?? null,
    },
    filters: {
      ...selectedFilters,
      ...extraFilters,
    },
    sort: value.sortOrder,
    page,
    size,
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getProductByType = async (
  type?: string,
  size?: number,
  sort?: string[],
): Promise<ProductDetailDto[]> => {
  const res = await axios.get(
    `${BASE_URL}/products?type=${type}${size ? `&size=${size}` : ""}${sort ? `&sort=${sort.join(",")}` : ""}`,
  );
  return res.data.data.items;
};

const getNewProducts = async (size?: number): Promise<ProductDetailDto[]> => {
  const res = await axios.get(
    `${BASE_URL}/products?${size ? `&size=${size}` : ""}&sort=id.desc`,
  );
  return res.data.data.items;
};

const detail = async (id: number): Promise<ProductDetailDto> => {
  const res = await axios.get(`${BASE_URL}/products/${id}`);
  return res.data.data;
};
const getProductPageByType = async (
  type?: string,
  page: number = 0,
  size: number = 5,
  sort?: string[],
): Promise<ProductPageDto> => {
  const params = new URLSearchParams();

  if (type) params.append("type", type);
  params.append("page", String(page));
  params.append("size", String(size));

  if (sort?.length) {
    params.append("sort", sort.join(","));
  }

  const res = await axios.get(`${BASE_URL}/products?${params.toString()}`);

  return res.data.data;
};

const filterProducts = async (
  payload: ProductFilterRequest,
): Promise<ProductPageDto> => {
  const { data } = await axios.post<ResponseResult<ProductPageDto>>(
    `${BASE_URL}/products/filter`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return data.data;
};
export {
  getProductByType,
  getNewProducts,
  detail,
  getProductPageByType,
  filterProducts,
  buildProductFilterRequest,
};
