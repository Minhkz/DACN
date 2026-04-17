import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { ProductPageDto } from "@/types/product/ProductPageDto";
import axios from "axios";

const getProductByType = async (
  type?: string,
  size?: number,
  sort?: string[],
): Promise<ProductDetailDto[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products?type=${type}${size ? `&size=${size}` : ""}${sort ? `&sort=${sort.join(",")}` : ""}`,
  );
  return res.data.data.items;
};

const getNewProducts = async (size?: number): Promise<ProductDetailDto[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${size ? `&size=${size}` : ""}&sort=id.desc`,
  );
  return res.data.data.items;
};

const detail = async (id: number): Promise<ProductDetailDto> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
  );
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

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
  );

  return res.data.data;
};
export { getProductByType, getNewProducts, detail, getProductPageByType };
