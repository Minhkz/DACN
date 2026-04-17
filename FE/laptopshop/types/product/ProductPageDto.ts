import { ProductDetailDto } from "./ProductDetailDto";

export interface ProductPageDto {
  items: ProductDetailDto[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  last: boolean;
}

export interface ProductListApiResponse {
  datetime: string;
  errorCode: string;
  message: string;
  data: ProductPageDto;
  success: boolean;
}
