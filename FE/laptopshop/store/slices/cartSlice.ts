import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartDto, CartItemDto, CartProductDto } from "@/types/cart/cart";
import { cartService } from "@/services/cart/CartService";
import { RootState } from "@/store";
import { notify } from "@/utils/notify";

type CartState = {
  cart: CartProductDto | null;
  loading: boolean;
  error: string | null;
  pendingProductIds: number[];
};

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  pendingProductIds: [],
};

//
// ─── FETCH CART ─────────────────────────────────────────
//
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const cartDto: CartDto = await cartService.getMyCart();
      const items = await cartService.getProductCart();
      return { ...cartDto, items } as CartProductDto;
    } catch (err) {
      return rejectWithValue("Error");
    }
  },
);

//
// ─── CREATE CART ────────────────────────────────────────
//
export const createCart = createAsyncThunk(
  "cart/create",
  async (_, { rejectWithValue }) => {
    try {
      const cartDto = await cartService.create();

      return {
        ...cartDto,
        items: [] as CartItemDto[],
      } as CartProductDto;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Create cart failed",
      );
    }
  },
);

//
// ─── ADD PRODUCT ────────────────────────────────────────
//
export const addToCart = createAsyncThunk(
  "cart/addProduct",
  async (
    {
      productId,
      quantity,
      item,
    }: {
      productId: number;
      quantity: number;
      item: CartItemDto;
    },
    { dispatch, rejectWithValue, getState },
  ) => {
    const previousCart = (getState() as RootState).cart.cart;

    // optimistic update
    dispatch(optimisticAdd(item));

    try {
      await cartService.addProduct(productId, quantity);
      return productId;
    } catch (err) {
      dispatch(rollbackCart(previousCart));
      return rejectWithValue("Error");
    }
  },
);

//
// ─── UPDATE QUANTITY ─────────────────────────────────────
//
export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    {
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    },
    { dispatch, rejectWithValue, getState },
  ) => {
    const previousCart = (getState() as RootState).cart.cart;

    // optimistic update
    dispatch(optimisticUpdateQty({ productId, quantity }));

    try {
      await cartService.updateQuantityProduct(productId, quantity);
      return { productId, quantity };
    } catch (err) {
      dispatch(rollbackCart(previousCart));
      return rejectWithValue("Error");
    }
  },
);

//
// ─── REMOVE PRODUCT ─────────────────────────────────────
//
export const removeFromCart = createAsyncThunk(
  "cart/removeProduct",
  async (
    { productId }: { productId: number },
    { dispatch, rejectWithValue, getState },
  ) => {
    const previousCart = (getState() as RootState).cart.cart;

    // optimistic update
    dispatch(optimisticRemove(productId));

    try {
      await cartService.removeProduct(productId);
      return productId;
    } catch (err) {
      dispatch(rollbackCart(previousCart));
      return rejectWithValue("Error");
    }
  },
);

//
// ─── CLEAR CART ──────────────────────────────────────────
//
export const clearCartProducts = createAsyncThunk(
  "cart/clear",
  async (_, { dispatch, rejectWithValue, getState }) => {
    const previousCart = (getState() as RootState).cart.cart;

    // optimistic update
    dispatch(optimisticClear());

    try {
      await cartService.clear();
    } catch (err) {
      dispatch(rollbackCart(previousCart));
      return rejectWithValue("Error");
    }
  },
);

//
// ─── SLICE ──────────────────────────────────────────────
//
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
    },

    // optimistic add
    optimisticAdd: (state, action: PayloadAction<CartItemDto>) => {
      if (!state.cart) return;
      const exists = state.cart.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (exists) {
        exists.qty += action.payload.qty;
      } else {
        state.cart.items.push(action.payload);
      }
    },

    // optimistic update quantity
    optimisticUpdateQty: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      if (!state.cart) return;
      const item = state.cart.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (item) {
        item.qty = action.payload.quantity;
      }
    },

    // optimistic remove
    optimisticRemove: (state, action: PayloadAction<number>) => {
      if (!state.cart) return;
      state.cart.items = state.cart.items.filter(
        (item) => item.productId !== action.payload,
      );
    },

    // optimistic clear
    optimisticClear: (state) => {
      if (!state.cart) return;
      state.cart.items = [];
    },

    // rollback
    rollbackCart: (state, action: PayloadAction<CartProductDto | null>) => {
      state.cart = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      //
      // FETCH
      //
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //
      // CREATE
      //
      .addCase(createCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      //
      // ADD
      //
      .addCase(addToCart.pending, (state, action) => {
        state.pendingProductIds.push(action.meta.arg.productId);
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.payload,
        );
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.meta.arg.productId,
        );
        notify("error", "Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
      })

      //
      // UPDATE QUANTITY
      //
      .addCase(updateCartQuantity.pending, (state, action) => {
        state.pendingProductIds.push(action.meta.arg.productId);
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.payload?.productId,
        );
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.meta.arg.productId,
        );
        notify("error", "Không thể cập nhật số lượng. Vui lòng thử lại!");
      })

      //
      // REMOVE
      //
      .addCase(removeFromCart.pending, (state, action) => {
        state.pendingProductIds.push(action.meta.arg.productId);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.payload,
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter(
          (id) => id !== action.meta.arg.productId,
        );
        notify("error", "Không thể xóa sản phẩm. Vui lòng thử lại!");
      })

      //
      // CLEAR
      //
      .addCase(clearCartProducts.rejected, () => {
        notify("error", "Không thể xóa giỏ hàng. Vui lòng thử lại!");
      });
  },
});

export const {
  clearCart,
  optimisticAdd,
  optimisticUpdateQty,
  optimisticRemove,
  optimisticClear,
  rollbackCart,
} = cartSlice.actions;

export default cartSlice.reducer;
