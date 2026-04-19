export interface ReviewRequest {
  id?: number;
  productId: number;
  userId: number;
  rating: number;
  reviewContent: string;
}
