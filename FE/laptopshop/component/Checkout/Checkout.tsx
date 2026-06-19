"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutHeader from "./CheckoutHeader";
import ShippingInfo from "./ShippingInfo";
import PaymentMethod, { PaymentMethodId } from "./PaymentMethod";
import OrderSummary from "./Ordersummary";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCartProducts, fetchCart } from "@/store/slices/cartSlice";
import { OrderRequest } from "@/types/order/order";
import orderService from "@/services/order/OrderService";
import { notify } from "@/utils/notify";
import { createVNPayPayment } from "@/services/pay/PayService";
import { useCreateVNPayPayment } from "@/hook/useCreateVNPayPayment";

const currency = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

export default function Checkout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { cart, loading } = useAppSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("cod");

  const [ordering, setOrdering] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = useMemo(() => {
    return (cart?.items ?? []).reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
  }, [cart?.items]);

  const shipping = subtotal >= 5000000 ? 0 : 30000;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const checkoutItems =
    cart?.items.map((item) => ({
      id: item.productId,
      productId: item.productId,
      name: item.productName,
      qty: item.qty,
      price: currency(item.price),
      imageUrl: item.avatar,
    })) ?? [];

  const { mutateAsync: createVNPayPaymentAsync } = useCreateVNPayPayment();

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      notify("info", "Giỏ hàng đang trống. Vui lòng thêm sản phẩm.");
      return;
    }

    if (!shippingAddress.trim()) {
      notify("info", "Vui lòng nhập địa chỉ giao hàng.");
      return;
    }

    try {
      setOrdering(true);

      const payload: OrderRequest = {
        shippingAddress,
        paymentMethod,
        products: cart.items.map((item) => ({
          productId: item.productId,
          qty: item.qty,
        })),
      };

      const order = await orderService.create(payload);

      switch (paymentMethod) {
        case "cod": {
          await dispatch(clearCartProducts());

          notify("success", "Đặt hàng thành công!");

          router.push(`/cart`);

          return;
        }

        case "vnpay": {
          const result = await createVNPayPaymentAsync({
            amount: total,
            orderInfo: `Thanh toán đơn hàng #${order.id}`,
            orderId: order.id,
          });

          window.location.href = result.paymentUrl;

          return;
        }

        default:
          notify("error", "Phương thức thanh toán không hợp lệ.");
      }
    } catch (error: any) {
      notify("error", error.response?.data?.message ?? "Đặt hàng thất bại");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center">
        <p className="text-slate-600 font-semibold">
          Đang tải thông tin thanh toán...
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <main style={{ minHeight: "100vh", background: "#F5F7FF" }}>
          <section
            className="container-global"
            style={{ padding: "42px 0 64px" }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbe7ff",
                borderRadius: "18px",
                padding: "28px",
                marginBottom: "24px",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div
                style={{
                  height: "36px",
                  width: "240px",
                  borderRadius: "8px",
                  background: "#e2e8f0",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  border: "1px solid #dbe7ff",
                  borderRadius: "18px",
                  padding: "22px",
                  marginBottom: "18px",
                  height: "160px",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
          </section>
        </main>
      </>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F5F7FF]"
      style={{ padding: "40px 0 64px" }}
    >
      <div className="container-global">
        <CheckoutHeader />

        <div
          className="flex flex-col lg:flex-row w-full items-start"
          style={{ gap: "28px" }}
        >
          <div className="flex-[2] w-full">
            <ShippingInfo onAddressChange={setShippingAddress} />

            <PaymentMethod
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>

          <div className="w-full lg:max-w-[400px] flex-1">
            <OrderSummary
              cartItems={checkoutItems}
              subtotal={currency(subtotal)}
              shipping={shipping === 0 ? "Miễn phí" : currency(shipping)}
              discount={currency(discount)}
              total={currency(total)}
              ordering={ordering}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
