export interface ProductRequest {
  id?: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  sold: number;
  view: number;
  avatar: File | null;
  images: (File | null)[];
}
