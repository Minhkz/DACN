export interface ProductDetailDto {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  view: number;
  avatar: string;
  imgs: string[];
  filters: string[];
}
