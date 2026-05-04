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
  pendingProductIds: number[];
};

const initialState: WishlistState = {
  wishlist: null,
  loading: false,
  error: null,
  pendingProductIds: [],
};

//
// ─── FETCH WISHLIST ─────────────────────────────────────
//
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const wishlistDto: WishlistDto = await wishlistService.getMyWishlist();

      const items = await wishlistService.getProducts();

      return { ...wishlistDto, items } as WishlistProductDto;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

//
// ─── CREATE WISHLIST ────────────────────────────────────
//
export const createWishlist = createAsyncThunk(
  "wishlist/create",
  async (_, { rejectWithValue }) => {
    try {
      const wishlistDto = await wishlistService.create();
      return { ...wishlistDto, items: [] } as WishlistProductDto;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

//
// ─── ADD PRODUCT ────────────────────────────────────────
//
export const addToWishlist = createAsyncThunk(
  "wishlist/addProduct",
  async (
    {
      productId,
      item,
    }: {
      productId: number;
      item: WishlistItemDto;
    },
    { dispatch, rejectWithValue, getState },
  ) => {
    const previousWishlist = (getState() as RootState).wishlist.wishlist;

    // optimistic update
    dispatch(optimisticAdd(item));

    try {
      await wishlistService.addProduct(productId);
      return productId;
    } catch (err: any) {
      dispatch(rollbackWishlist(previousWishlist));
      return rejectWithValue(err.message);
    }
  },
);

//
// ─── REMOVE PRODUCT ─────────────────────────────────────
//
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeProduct",
  async (
    { productId }: { productId: number }, // bỏ wishlistId
    { dispatch, rejectWithValue, getState },
  ) => {
    const previousWishlist = (getState() as RootState).wishlist.wishlist;
    dispatch(optimisticRemove(productId));
    try {
      await wishlistService.removeProduct(productId);
      return productId;
    } catch (err: any) {
      dispatch(rollbackWishlist(previousWishlist));
      return rejectWithValue(err.message);
    }
  },
);

//
// ─── SLICE ──────────────────────────────────────────────
//
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = null;
    },

    // optimistic add
    optimisticAdd: (state, action: PayloadAction<WishlistItemDto>) => {
      if (!state.wishlist) return;
      state.wishlist.items.push(action.payload);
    },

    // optimistic remove
    optimisticRemove: (state, action: PayloadAction<number>) => {
      if (!state.wishlist) return;

      state.wishlist.items = state.wishlist.items.filter(
        (item) => item.productId !== action.payload,
      );
    },

    // rollback
    rollbackWishlist: (
      state,
      action: PayloadAction<WishlistProductDto | null>,
    ) => {
      state.wishlist = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      //
      // FETCH
      //
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

      //
      // CREATE
      //
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })

      //
      // ADD
      //
      .addCase(addToWishlist.pending, (state, action) => {
        state.pendingProductIds.push(action.meta.arg.productId);
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

      //
      // REMOVE
      //
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
