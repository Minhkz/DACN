export interface ReviewRequest {
  id?: number;
  productId: number;
  userId: string;
  rating: number;
  reviewContent: string;
}
