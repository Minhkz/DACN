'use client';

import { Modal } from '@/components/ui/modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import {
  CreditCard,
  Eye,
  MapPin,
  Package,
  Pencil,
  Trash2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { OrderAdminDto } from '@/types/order/order';
import { formatTimeAgo } from '@/util/dateTime';
import { formatCurrency } from '@/util/formatCurrency';
import {
  detail,
  removeOrder,
  updateStatus,
} from '@/services/order/OrderService';
import { notify } from '@/util/notify';

type OrderActionProps = {
  orderId: number;
};

const getOrderStatusStyle = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-700';
    case 'SHIPPING':
      return 'bg-purple-100 text-purple-700';
    case 'COMPLETED':
      return 'bg-green-100 text-green-700';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getPaymentStatusStyle = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-700';
    case 'UNPAID':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const OrderAction = ({ orderId }: OrderActionProps) => {
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [status, setStatus] = useState<string>('');
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    isFetching,
    isError,
  } = useQuery<OrderAdminDto>({
    queryKey: ['order-admin-detail', orderId],
    queryFn: () => detail(orderId),
    enabled: openView,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      updateStatus(orderId, status),
    onSuccess: () => {
      notify('success', 'Cập nhật trạng thái đơn hàng thành công');

      setOpenUpdate(false);
      setStatus('');

      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });

      queryClient.invalidateQueries({
        queryKey: ['order-admin-detail', orderId],
      });
    },
    onError: () => {
      notify('error', 'Cập nhật trạng thái đơn hàng thất bại');
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: () => removeOrder(orderId),

    onSuccess: () => {
      notify('success', 'Xóa đơn hàng thành công');

      setOpenDelete(false);

      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },

    onError: () => {
      notify('error', 'Xóa đơn hàng thất bại');
    },
  });

  const totalPrice =
    order?.products?.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ) ?? 0;

  return (
    <div className="flex items-center gap-3">
      {/* View */}
      <button
        type="button"
        title="View"
        onClick={() => setOpenView(true)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <Eye size={18} />
      </button>

      {/* Update */}
      <button
        type="button"
        title="Update"
        onClick={() => setOpenUpdate(true)}
        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
      >
        <Pencil size={18} />
      </button>

      {/* Delete */}
      <button
        type="button"
        title="Delete"
        onClick={() => setOpenDelete(true)}
        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        <Trash2 size={18} />
      </button>

      {/* View Modal */}
      <Modal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        className="max-w-2xl"
      >
        <div
          className="max-h-[80vh] overflow-y-auto"
          style={{ padding: '20px' }}
        >
          {isLoading || isFetching ? (
            <div
              className="flex items-center justify-center"
              style={{ padding: '40px' }}
            >
              <Spin />
            </div>
          ) : isError ? (
            <div
              className="rounded-lg bg-red-50 text-center text-sm text-red-600"
              style={{ padding: '16px' }}
            >
              Không thể tải chi tiết đơn hàng
            </div>
          ) : !order ? (
            <div
              className="rounded-lg bg-gray-50 text-center text-sm text-gray-500"
              style={{ padding: '16px' }}
            >
              Không có dữ liệu đơn hàng
            </div>
          ) : (
            <>
              {/* Header */}
              <div
                className="border-b border-gray-200"
                style={{ paddingBottom: '16px', marginBottom: '16px' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Chi tiết đơn hàng #{order.id}
                    </h2>

                    <p
                      className="text-sm text-gray-500"
                      style={{ marginTop: '4px' }}
                    >
                      Ngày tạo: {formatTimeAgo(order.createdDate)}
                    </p>
                  </div>

                  <Package className="text-gray-400" size={28} />
                </div>
              </div>

              {/* Status */}
              <div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                style={{ marginBottom: '16px' }}
              >
                <div
                  className="rounded-lg bg-gray-50"
                  style={{ padding: '12px' }}
                >
                  <p
                    className="text-xs text-gray-500"
                    style={{ marginBottom: '6px' }}
                  >
                    Trạng thái đơn hàng
                  </p>

                  <span
                    className={`inline-flex rounded-full text-xs font-medium ${getOrderStatusStyle(
                      order.status
                    )}`}
                    style={{ padding: '4px 10px' }}
                  >
                    {order.status}
                  </span>
                </div>

                <div
                  className="rounded-lg bg-gray-50"
                  style={{ padding: '12px' }}
                >
                  <p
                    className="text-xs text-gray-500"
                    style={{ marginBottom: '6px' }}
                  >
                    Trạng thái thanh toán
                  </p>

                  <span
                    className={`inline-flex rounded-full text-xs font-medium ${getPaymentStatusStyle(
                      order.paymentStatus
                    )}`}
                    style={{ padding: '4px 10px' }}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div
                className="rounded-lg border border-gray-200"
                style={{ padding: '14px', marginBottom: '16px' }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ marginBottom: '12px' }}
                >
                  <User size={16} className="text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Thông tin khách hàng
                  </h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Mã người dùng</span>
                    <span className="text-right font-medium text-gray-800">
                      {order.userId ?? 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Username</span>
                    <span className="text-right font-medium text-gray-800">
                      {order.username || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Họ tên</span>
                    <span className="text-right font-medium text-gray-800">
                      {order.fullName || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Email</span>
                    <span className="text-right font-medium break-all text-gray-800">
                      {order.email || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Số điện thoại</span>
                    <span className="text-right font-medium text-gray-800">
                      {order.phone || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div
                className="rounded-lg border border-gray-200"
                style={{ padding: '14px', marginBottom: '16px' }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ marginBottom: '12px' }}
                >
                  <MapPin size={16} className="text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Thông tin giao hàng
                  </h3>
                </div>

                <div className="text-sm">
                  <p className="text-gray-500" style={{ marginBottom: '4px' }}>
                    Địa chỉ nhận hàng
                  </p>

                  <p className="leading-5 font-medium text-gray-800">
                    {order.shippingAddress || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div
                className="rounded-lg border border-gray-200"
                style={{ padding: '14px', marginBottom: '16px' }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ marginBottom: '12px' }}
                >
                  <CreditCard size={16} className="text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Thông tin thanh toán
                  </h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Phương thức</span>
                    <span className="text-right font-medium text-gray-800">
                      {order.paymentMethod || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Trạng thái</span>
                    <span className="text-right font-medium text-gray-800">
                      {order.paymentStatus || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div
                className="rounded-lg border border-gray-200"
                style={{ padding: '14px', marginBottom: '16px' }}
              >
                <h3
                  className="text-sm font-semibold text-gray-800"
                  style={{ marginBottom: '12px' }}
                >
                  Sản phẩm đã đặt
                </h3>

                <div className="space-y-3">
                  {order.products?.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-lg bg-gray-50"
                      style={{ padding: '10px' }}
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                        {item.productAvatar ? (
                          <Image
                            src={item.productAvatar}
                            alt={item.productName || 'product'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No img
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-gray-800">
                          {item.productName || 'Sản phẩm không tồn tại'}
                        </p>

                        <p
                          className="text-xs text-gray-500"
                          style={{ marginTop: '4px' }}
                        >
                          Số lượng: {item.quantity}
                        </p>

                        <div
                          className="flex items-center justify-between gap-3"
                          style={{ marginTop: '6px' }}
                        >
                          <span className="text-sm font-semibold text-gray-800">
                            {formatCurrency(item.price)}
                          </span>

                          <span className="text-sm font-semibold text-red-600">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div
                className="rounded-lg border border-red-100 bg-red-50"
                style={{ padding: '14px', marginBottom: '16px' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Tổng tiền
                  </span>

                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpenView(false)}
                  className="rounded-lg bg-gray-800 text-sm font-medium text-white transition hover:bg-gray-700"
                  style={{ padding: '9px 16px' }}
                >
                  Đóng
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal
        isOpen={openUpdate}
        onClose={() => setOpenUpdate(false)}
        className="max-w-md"
      >
        <div style={{ padding: '20px' }}>
          {/* Header */}
          <div
            className="border-b border-gray-200"
            style={{ paddingBottom: '14px', marginBottom: '16px' }}
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Cập nhật trạng thái đơn hàng
            </h2>

            <p className="text-sm text-gray-500" style={{ marginTop: '4px' }}>
              Đơn hàng #{orderId}
            </p>
          </div>

          {/* Form */}
          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="order-status"
              className="block text-sm font-medium text-gray-700"
              style={{ marginBottom: '8px' }}
            >
              Trạng thái đơn hàng
            </label>

            <select
              id="order-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              style={{ padding: '10px 12px' }}
            >
              <option value="">-- Chọn trạng thái --</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SHIPPING">SHIPPING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <p className="text-xs text-gray-500" style={{ marginTop: '8px' }}>
              Chỉ cập nhật trạng thái xử lý của đơn hàng.
            </p>
          </div>

          {/* Preview */}
          {status && (
            <div
              className="rounded-lg bg-gray-50"
              style={{ padding: '12px', marginBottom: '18px' }}
            >
              <p
                className="text-xs text-gray-500"
                style={{ marginBottom: '6px' }}
              >
                Trạng thái mới
              </p>

              <span
                className={`inline-flex rounded-full text-xs font-medium ${getOrderStatusStyle(
                  status
                )}`}
                style={{ padding: '4px 10px' }}
              >
                {status}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setOpenUpdate(false);
                setStatus('');
              }}
              className="rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              style={{ padding: '9px 14px' }}
              disabled={updateStatusMutation.isPending}
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={() => updateStatusMutation.mutate({ status })}
              disabled={!status || updateStatusMutation.isPending}
              className="rounded-lg bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              style={{ padding: '9px 14px' }}
            >
              {updateStatusMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        className="max-w-md"
      >
        <div className="p-5">
          {/* Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 size={24} className="text-red-600" />
          </div>

          {/* Content */}
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Xóa đơn hàng
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Bạn có chắc chắn muốn xóa đơn hàng{' '}
              <span className="font-semibold text-gray-800">#{orderId}</span>{' '}
              không? Hành động này không thể hoàn tác.
            </p>
          </div>

          {/* Warning */}
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">
              Lưu ý: Sau khi xóa, thông tin đơn hàng sẽ không còn hiển thị trong
              danh sách quản trị.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenDelete(false)}
              disabled={deleteOrderMutation.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={() => deleteOrderMutation.mutate()}
              disabled={deleteOrderMutation.isPending}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {deleteOrderMutation.isPending ? 'Đang xóa...' : 'Xóa đơn hàng'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderAction;
