import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  WishlistDto,
  WishlistItemDto,
  WishlistProductDto,
} from "@/types/wishlist/wishlist";
import { wishlistService } from "@/services/wishlist/WishlistService";
import { RootState } from "@/store";
import { notify } from "@/utils/notify";

type WishlistState = {
  wishlist: WishlistProductDto | null;
  loading: boolean;
  error: string | null;
  pendingProductIds: number[]; // Track từng nút đang loading
};

const initialState: WishlistState = {
  wishlist: null,
  loading: false,
  error: null,
  pendingProductIds: [],
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchByUserId",
  async (userId: number, { rejectWithValue }) => {
    try {
      const wishlistDto = await wishlistService.getByUserId(userId);
      const items = await wishlistService.getProducts(wishlistDto.id);
      // Merge thành WishlistProductDto
      return { ...wishlistDto, items } as WishlistProductDto;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addProduct",
  async (
    {
      wishlistId,
      productId,
      item,
    }: {
      wishlistId: number;
      productId: number;
      item: WishlistItemDto;
    },
    { dispatch, rejectWithValue, getState },
  ) => {
    const previousWishlist = (getState() as RootState).wishlist.wishlist;
    dispatch(optimisticAdd(item));

    try {
      await wishlistService.addProduct(wishlistId, productId);
      return productId;
    } catch (err: any) {
      dispatch(rollbackWishlist(previousWishlist));
      return rejectWithValue(err.message);
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeProduct",
  async (
    { wishlistId, productId }: { wishlistId: number; productId: number },
    { dispatch, rejectWithValue, getState },
  ) => {
    const previousWishlist = (getState() as RootState).wishlist.wishlist;

    // Xóa khỏi UI ngay lập tức
    dispatch(optimisticRemove(productId));

    try {
      await wishlistService.removeProduct(wishlistId, productId);
      return productId;
    } catch (err: any) {
      // Thất bại → rollback
      dispatch(rollbackWishlist(previousWishlist));
      return rejectWithValue(err.message);
    }
  },
);

export const createWishlist = createAsyncThunk(
  "wishlist/create",
  async (userId: number, { rejectWithValue }) => {
    try {
      const wishlistDto: WishlistDto = await wishlistService.create(userId);

      return { ...wishlistDto, items: [] } as WishlistProductDto;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = null;
    },

    // Thêm item vào UI ngay (không chờ API)
    optimisticAdd: (state, action: PayloadAction<WishlistItemDto>) => {
      state.wishlist?.items.push(action.payload);
    },

    // Xóa item khỏi UI ngay (không chờ API)
    optimisticRemove: (state, action: PayloadAction<number>) => {
      if (state.wishlist) {
        state.wishlist.items = state.wishlist.items.filter(
          (item) => item.productId !== action.payload,
        );
      }
    },

    // Hoàn về state cũ nếu API lỗi
    rollbackWishlist: (
      state,
      action: PayloadAction<WishlistProductDto | null>,
    ) => {
      state.wishlist = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // ─── fetchWishlist ───────────────────────────────
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── createWishlist ──────────────────────────────
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })

      // ─── addToWishlist ───────────────────────────────
      .addCase(addToWishlist.pending, (state, action) => {
        state.pendingProductIds.push(action.meta.arg.productId); // Đánh dấu nút đang loading
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.payload,
        );
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.meta.arg.productId,
        );
        notify("error", "Không thể thêm vào wishlist. Vui lòng thử lại!");
      })

      // ─── removeFromWishlist ──────────────────────────
      .addCase(removeFromWishlist.pending, (state, action) => {
        state.pendingProductIds.push(action.meta.arg.productId);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.payload,
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.meta.arg.productId,
        );
        notify("error", "Không thể xóa khỏi wishlist. Vui lòng thử lại!");
      });
  },
});

export const {
  clearWishlist,
  optimisticAdd,
  optimisticRemove,
  rollbackWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
