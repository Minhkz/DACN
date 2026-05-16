"use client";

import React, { useState } from "react";
import {
  PackageSearch,
  CalendarDays,
  CreditCard,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingBag,
  XCircle,
  X,
  User,
  Hash,
  AlertTriangle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { OrderDto } from "@/types/order/order";
import orderService from "@/services/order/OrderService";

const formatPrice = (value?: number | string) => {
  if (value === undefined || value === null) {
    return "0đ";
  }

  return new Intl.NumberFormat("vi-VN").format(Number(value)) + "đ";
};

const formatDate = (value?: string) => {
  if (!value) return "Không xác định";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "SHIPPING":
      return "Đang giao hàng";
    case "COMPLETED":
      return "Đã hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

const getStatusClassName = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "SHIPPING":
      return "bg-orange-100 text-orange-700";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentMethodLabel = (paymentMethod: string) => {
  switch (paymentMethod?.toUpperCase()) {
    case "COD":
      return "Thanh toán khi nhận hàng";
    case "BANKING":
      return "Chuyển khoản ngân hàng";
    case "VNPAY":
      return "Thanh toán VNPAY";
    case "MOMO":
      return "Thanh toán MoMo";
    default:
      return paymentMethod || "Không xác định";
  }
};

const canCancelOrder = (status: string) => {
  return status === "PENDING" || status === "CONFIRMED";
};

export default function OrdersTab() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [size] = useState(5);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [cancelOrderTarget, setCancelOrderTarget] = useState<OrderDto | null>(
    null,
  );
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["my-orders", page, size],
    queryFn: () => orderService.getMyOrders(page - 1, size),
    staleTime: 60 * 1000,
  });

  const {
    data: orderDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery({
    queryKey: ["order-detail", selectedOrderId],
    queryFn: () => orderService.detail(selectedOrderId as number),
    enabled: !!selectedOrderId && isDetailOpen,
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: number) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order-detail", selectedOrderId],
      });

      setIsCancelOpen(false);
      setCancelOrderTarget(null);
    },
  });

  const orders = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;

  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedOrderId(null);
  };

  const handleCancelOrder = (orderId: number) => {
    const order = orders.find((item) => item.id === orderId);

    if (!order) return;

    setCancelOrderTarget(order);
    setIsCancelOpen(true);
  };

  const handleCloseCancelModal = () => {
    if (cancelMutation.isPending) return;

    setIsCancelOpen(false);
    setCancelOrderTarget(null);
  };

  const handleConfirmCancelOrder = () => {
    if (!cancelOrderTarget) return;

    cancelMutation.mutate(cancelOrderTarget.id);
  };

  if (isLoading) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center text-gray-500"
        style={{ minHeight: "320px" }}
      >
        <Loader2 className="animate-spin" size={32} strokeWidth={2.3} />

        <p className="font-medium" style={{ marginTop: "12px" }}>
          Đang tải danh sách đơn hàng...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="w-full bg-red-50 border border-red-200 rounded-xl text-red-600"
        style={{ padding: "20px" }}
      >
        Không thể tải danh sách đơn hàng.
      </div>
    );
  }

  return (
    <>
      <div className="animate-in fade-in duration-300 w-full">
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200"
          style={{
            paddingBottom: "18px",
            marginBottom: "24px",
            gap: "16px",
          }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Tất cả đơn hàng
            </h2>

            <p className="text-sm text-gray-500" style={{ marginTop: "6px" }}>
              Tổng cộng {totalItems} đơn hàng
            </p>
          </div>

          {(isFetching || cancelMutation.isPending) && (
            <div className="flex items-center text-sm text-blue-600 font-medium">
              <Loader2
                className="animate-spin"
                size={16}
                strokeWidth={2.3}
                style={{ marginRight: "8px" }}
              />
              Đang cập nhật...
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div
            className="bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center text-center"
            style={{ padding: "48px 24px" }}
          >
            <div
              className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"
              style={{ marginBottom: "16px" }}
            >
              <ShoppingBag size={34} strokeWidth={1.8} />
            </div>

            <h3
              className="text-lg font-bold text-gray-900"
              style={{ marginBottom: "8px" }}
            >
              Chưa có đơn hàng
            </h3>

            <p className="text-sm text-gray-500">
              Bạn chưa có đơn hàng nào trong hệ thống.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col" style={{ gap: "16px" }}>
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={handleViewOrder}
                  onCancel={handleCancelOrder}
                  canceling={cancelMutation.isPending}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
      </div>

      <OrderDetailModal
        open={isDetailOpen}
        order={orderDetail}
        loading={isDetailLoading}
        error={isDetailError}
        onClose={handleCloseDetail}
      />

      <CancelOrderModal
        open={isCancelOpen}
        order={cancelOrderTarget}
        loading={cancelMutation.isPending}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancelOrder}
      />
    </>
  );
}

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const handlePrev = () => {
    if (page <= 1) return;
    onChange(page - 1);
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    onChange(page + 1);
  };

  if (totalPages <= 0) return null;

  return (
    <div
      className="flex justify-center items-center"
      style={{ gap: "10px", marginTop: "32px" }}
    >
      <button
        type="button"
        onClick={handlePrev}
        disabled={page <= 1}
        className="bg-white border border-gray-300 text-gray-600 rounded-full font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        style={{ width: "40px", height: "40px" }}
      >
        <ChevronLeft size={18} strokeWidth={2.4} />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1;
        const isActive = page === pageNumber;

        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onChange(pageNumber)}
            className={
              isActive
                ? "bg-blue-600 text-white rounded-full font-bold shadow-md shadow-blue-500/20"
                : "bg-white border border-gray-300 text-gray-600 rounded-full font-bold hover:bg-gray-50"
            }
            style={{ width: "40px", height: "40px" }}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        onClick={handleNext}
        disabled={page >= totalPages}
        className="bg-white border border-gray-300 text-gray-600 rounded-full font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        style={{ width: "40px", height: "40px" }}
      >
        <ChevronRight size={18} strokeWidth={2.4} />
      </button>
    </div>
  );
}

type OrderCardProps = {
  order: OrderDto;
  onView: (orderId: number) => void;
  onCancel: (orderId: number) => void;
  canceling: boolean;
};

function OrderCard({ order, onView, onCancel, canceling }: OrderCardProps) {
  const firstItem = order.items?.[0];

  const totalQuantity =
    order.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const isCancelable = canCancelOrder(order.status);

  const productImage =
    firstItem?.productAvatar || firstItem?.product?.avatar || "";

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
      style={{ padding: "20px" }}
    >
      <div
        className="flex flex-col xl:flex-row xl:items-center xl:justify-between"
        style={{ gap: "18px" }}
      >
        <div className="flex-1 min-w-0">
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
            style={{ gap: "12px", marginBottom: "16px" }}
          >
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"
                style={{ marginRight: "12px" }}
              >
                <PackageSearch size={22} strokeWidth={2.3} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Đơn hàng #{order.id}
                </h3>

                <div
                  className="flex items-center text-sm text-gray-500"
                  style={{ marginTop: "4px" }}
                >
                  <CalendarDays
                    size={15}
                    strokeWidth={2.2}
                    style={{ marginRight: "6px" }}
                  />

                  {formatDate(order.createdDate)}
                </div>
              </div>
            </div>

            <span
              className={`rounded-full font-bold text-xs inline-block ${getStatusClassName(
                order.status,
              )}`}
              style={{ padding: "7px 14px" }}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-3"
            style={{ gap: "14px" }}
          >
            <div className="text-sm text-gray-600">
              <div className="flex items-start">
                <MapPin
                  size={16}
                  strokeWidth={2.2}
                  className="text-emerald-600 flex-shrink-0"
                  style={{
                    marginRight: "8px",
                    marginTop: "2px",
                  }}
                />

                <span className="line-clamp-2">
                  {order.shippingAddress || "Chưa có địa chỉ giao hàng"}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <div className="flex items-center">
                <CreditCard
                  size={16}
                  strokeWidth={2.2}
                  className="text-blue-600"
                  style={{ marginRight: "8px" }}
                />

                <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Tổng sản phẩm:</span>{" "}
              {totalQuantity}
            </div>
          </div>

          {firstItem && (
            <div
              className="bg-gray-50 border border-gray-100 rounded-lg flex items-center"
              style={{
                padding: "12px",
                marginTop: "16px",
                gap: "12px",
              }}
            >
              <ProductImage
                src={productImage}
                alt={firstItem.productName || "Sản phẩm"}
              />

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {firstItem.productName || firstItem.product?.name}
                </p>

                <p
                  className="text-xs text-gray-500"
                  style={{ marginTop: "4px" }}
                >
                  SL: {firstItem.quantity} · {formatPrice(firstItem.price)}
                  {order.items.length > 1 &&
                    ` · và ${order.items.length - 1} sản phẩm khác`}
                </p>

                <p
                  className="text-xs text-gray-500"
                  style={{ marginTop: "2px" }}
                >
                  Tạm tính: {formatPrice(firstItem.subTotal)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center"
          style={{ gap: "14px" }}
        >
          <div className="text-left xl:text-right">
            <p className="text-sm text-gray-500">Tổng tiền</p>

            <p className="text-xl font-bold text-gray-900">
              {formatPrice(order.totalPrice)}
            </p>
          </div>

          <div className="flex items-center" style={{ gap: "10px" }}>
            <button
              type="button"
              onClick={() => onView(order.id)}
              title="Xem chi tiết"
              className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
            >
              <Eye size={20} strokeWidth={2.4} />
            </button>

            {isCancelable && (
              <button
                type="button"
                onClick={() => onCancel(order.id)}
                disabled={canceling}
                title="Hủy đơn hàng"
                className="w-10 h-10 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {canceling ? (
                  <Loader2
                    className="animate-spin"
                    size={20}
                    strokeWidth={2.4}
                  />
                ) : (
                  <XCircle size={20} strokeWidth={2.4} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type OrderDetailModalProps = {
  open: boolean;
  order?: OrderDto;
  loading: boolean;
  error: boolean;
  onClose: () => void;
};

function OrderDetailModal({
  open,
  order,
  loading,
  error,
  onClose,
}: OrderDetailModalProps) {
  if (!open) return null;

  const totalQuantity =
    order?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        style={{ padding: "0" }}
      >
        <div
          className="flex items-center justify-between border-b border-gray-200"
          style={{ padding: "18px 22px" }}
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Chi tiết đơn hàng
            </h3>

            <p className="text-sm text-gray-500" style={{ marginTop: "4px" }}>
              Thông tin sản phẩm, thanh toán và giao hàng
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center"
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 78px)" }}
        >
          {loading && (
            <div
              className="flex flex-col items-center justify-center text-gray-500"
              style={{ minHeight: "320px" }}
            >
              <Loader2 className="animate-spin" size={32} strokeWidth={2.3} />
              <p className="font-medium" style={{ marginTop: "12px" }}>
                Đang tải chi tiết đơn hàng...
              </p>
            </div>
          )}

          {error && !loading && (
            <div style={{ padding: "22px" }}>
              <div
                className="bg-red-50 border border-red-200 rounded-xl text-red-600"
                style={{ padding: "18px" }}
              >
                Không thể tải chi tiết đơn hàng.
              </div>
            </div>
          )}

          {!loading && !error && order && (
            <div style={{ padding: "22px" }}>
              <div
                className="grid grid-cols-1 lg:grid-cols-2"
                style={{ gap: "16px", marginBottom: "20px" }}
              >
                <InfoBox
                  icon={<Hash size={18} strokeWidth={2.3} />}
                  label="Mã đơn hàng"
                  value={`#${order.id}`}
                />

                <InfoBox
                  icon={<CalendarDays size={18} strokeWidth={2.3} />}
                  label="Ngày đặt"
                  value={formatDate(order.createdDate)}
                />

                <InfoBox
                  icon={<User size={18} strokeWidth={2.3} />}
                  label="Người đặt"
                  value={order.username || "Không xác định"}
                />

                <InfoBox
                  icon={<CreditCard size={18} strokeWidth={2.3} />}
                  label="Phương thức thanh toán"
                  value={getPaymentMethodLabel(order.paymentMethod)}
                />

                <div className="bg-gray-50 border border-gray-200 rounded-xl lg:col-span-2">
                  <div
                    className="flex items-start"
                    style={{ padding: "14px", gap: "10px" }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} strokeWidth={2.3} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Địa chỉ giao hàng
                      </p>

                      <p
                        className="text-sm font-bold text-gray-900"
                        style={{ marginTop: "4px" }}
                      >
                        {order.shippingAddress || "Chưa có địa chỉ giao hàng"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                style={{ gap: "12px", marginBottom: "16px" }}
              >
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Danh sách sản phẩm
                  </h4>

                  <p
                    className="text-sm text-gray-500"
                    style={{ marginTop: "4px" }}
                  >
                    Tổng số lượng: {totalQuantity}
                  </p>
                </div>

                <span
                  className={`rounded-full font-bold text-xs inline-block ${getStatusClassName(
                    order.status,
                  )}`}
                  style={{ padding: "8px 14px" }}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {order.items.map((item, index) => {
                  const productImage =
                    item.productAvatar || item.product?.avatar || "";

                  return (
                    <div
                      key={item.id}
                      className={
                        index !== order.items.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }
                      style={{ padding: "14px" }}
                    >
                      <div
                        className="flex flex-col sm:flex-row sm:items-center"
                        style={{ gap: "14px" }}
                      >
                        <ProductImage
                          src={productImage}
                          alt={item.productName || "Sản phẩm"}
                          large
                        />

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">
                            {item.productName || item.product?.name}
                          </p>

                          <p
                            className="text-sm text-gray-500"
                            style={{ marginTop: "4px" }}
                          >
                            Mã sản phẩm: {item.productId}
                          </p>

                          <div
                            className="grid grid-cols-1 sm:grid-cols-3"
                            style={{ gap: "10px", marginTop: "10px" }}
                          >
                            <ProductStat
                              label="Đơn giá"
                              value={formatPrice(item.price)}
                            />

                            <ProductStat
                              label="Số lượng"
                              value={String(item.quantity)}
                            />

                            <ProductStat
                              label="Tạm tính"
                              value={formatPrice(item.subTotal)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end" style={{ marginTop: "20px" }}>
                <div
                  className="bg-gray-50 border border-gray-200 rounded-xl w-full sm:w-auto"
                  style={{ padding: "16px", minWidth: "280px" }}
                >
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Tổng sản phẩm</span>
                    <span className="font-bold text-gray-900">
                      {totalQuantity}
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between border-t border-gray-200"
                    style={{ marginTop: "12px", paddingTop: "12px" }}
                  >
                    <span className="font-bold text-gray-900">Tổng tiền</span>

                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type CancelOrderModalProps = {
  open: boolean;
  order: OrderDto | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function CancelOrderModal({
  open,
  order,
  loading,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  if (!open || !order) return null;

  const firstItem = order.items?.[0];

  const totalQuantity =
    order.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const productImage =
    firstItem?.productAvatar || firstItem?.product?.avatar || "";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        style={{ padding: "0" }}
      >
        <div
          className="flex items-center justify-between border-b border-gray-200"
          style={{ padding: "18px 20px" }}
        >
          <div className="flex items-center" style={{ gap: "12px" }}>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle size={22} strokeWidth={2.4} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Xác nhận hủy đơn hàng
              </h3>

              <p className="text-sm text-gray-500" style={{ marginTop: "3px" }}>
                Đơn hàng #{order.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <div
            className="bg-red-50 border border-red-100 rounded-xl text-red-700"
            style={{ padding: "14px", marginBottom: "16px" }}
          >
            <p className="text-sm font-medium">
              Bạn có chắc chắn muốn hủy đơn hàng này không?
            </p>

            <p className="text-xs text-red-600" style={{ marginTop: "6px" }}>
              Sau khi hủy, đơn hàng sẽ chuyển sang trạng thái đã hủy.
            </p>
          </div>

          <div
            className="border border-gray-200 rounded-xl"
            style={{ padding: "14px" }}
          >
            <div
              className="flex items-center"
              style={{ gap: "12px", marginBottom: "14px" }}
            >
              {firstItem ? (
                <ProductImage
                  src={productImage}
                  alt={firstItem.productName || "Sản phẩm"}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center">
                  <ShoppingBag size={22} strokeWidth={1.8} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {firstItem?.productName ||
                    firstItem?.product?.name ||
                    "Đơn hàng"}
                </p>

                <p
                  className="text-xs text-gray-500"
                  style={{ marginTop: "4px" }}
                >
                  {order.items.length > 1
                    ? `${order.items.length} sản phẩm trong đơn hàng`
                    : "1 sản phẩm trong đơn hàng"}
                </p>
              </div>
            </div>

            <div
              className="grid grid-cols-2"
              style={{ gap: "10px", marginBottom: "10px" }}
            >
              <div
                className="bg-gray-50 rounded-lg"
                style={{ padding: "10px" }}
              >
                <p className="text-xs text-gray-500">Trạng thái</p>

                <p
                  className="text-sm font-bold text-gray-900"
                  style={{ marginTop: "4px" }}
                >
                  {getStatusLabel(order.status)}
                </p>
              </div>

              <div
                className="bg-gray-50 rounded-lg"
                style={{ padding: "10px" }}
              >
                <p className="text-xs text-gray-500">Tổng số lượng</p>

                <p
                  className="text-sm font-bold text-gray-900"
                  style={{ marginTop: "4px" }}
                >
                  {totalQuantity}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg" style={{ padding: "10px" }}>
              <p className="text-xs text-gray-500">Tổng tiền</p>

              <p
                className="text-lg font-bold text-red-600"
                style={{ marginTop: "4px" }}
              >
                {formatPrice(order.totalPrice)}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col-reverse sm:flex-row sm:justify-end"
            style={{ gap: "10px", marginTop: "20px" }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 px-5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: 10 }}
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="h-11 px-5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ padding: 10 }}
            >
              {loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={18}
                    strokeWidth={2.4}
                    style={{ marginRight: "8px" }}
                  />
                  Đang hủy...
                </>
              ) : (
                "Hủy"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type InfoBoxProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoBox({ icon, label, value }: InfoBoxProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl">
      <div
        className="flex items-center"
        style={{ padding: "14px", gap: "10px" }}
      >
        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium">{label}</p>

          <p
            className="text-sm font-bold text-gray-900 truncate"
            style={{ marginTop: "4px" }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

type ProductStatProps = {
  label: string;
  value: string;
};

function ProductStat({ label, value }: ProductStatProps) {
  return (
    <div className="bg-gray-50 rounded-lg" style={{ padding: "10px" }}>
      <p className="text-xs text-gray-500">{label}</p>

      <p
        className="text-sm font-bold text-gray-900"
        style={{ marginTop: "4px" }}
      >
        {value}
      </p>
    </div>
  );
}

type ProductImageProps = {
  src?: string;
  alt: string;
  large?: boolean;
};

function ProductImage({ src, alt, large = false }: ProductImageProps) {
  return (
    <div
      className="rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0"
      style={{
        width: large ? "76px" : "48px",
        height: large ? "76px" : "48px",
      }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <ShoppingBag size={large ? 30 : 22} strokeWidth={1.8} />
        </div>
      )}
    </div>
  );
}
