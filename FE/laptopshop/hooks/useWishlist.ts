import { wishlistService } from "@/services/wishlist/WishlistService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const WISHLIST_KEY = (userId: number) => ["wishlist", userId];

export const useWishlist = (userId: number) => {
  return useQuery({
    queryKey: WISHLIST_KEY(userId),
    queryFn: () => wishlistService.getByUserId(),
    enabled: !!userId,
  });
};

export const useRemoveFromWishlist = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      wishlistId,
      productId,
    }: {
      wishlistId: number;
      productId: number;
    }) => wishlistService.removeProduct(wishlistId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY(userId) });
    },
  });
};

export const useAddToCart = () => {
  return useMutation({
    mutationFn: (productIds: number[]) => {
      // Gọi cart service của bạn ở đây
      console.log("Add to cart:", productIds);
      return Promise.resolve();
    },
  });
};

// Thêm product vào wishlist
export const useAddToWishlist = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      wishlistId,
      productId,
    }: {
      wishlistId: number;
      productId: number;
    }) => wishlistService.addProduct(wishlistId, productId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY(userId) });
      queryClient.invalidateQueries({
        queryKey: ["wishlist-check", userId, productId],
      });
    },
  });
};
