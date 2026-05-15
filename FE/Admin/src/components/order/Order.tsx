'use client';

import React, { useState } from 'react';
import Loading from '../common/Loading';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Pagination, Spin } from 'antd';
import { formatTimeAgo } from '@/util/dateTime';

import { getAllOrders } from '@/services/order/OrderService';
import OrderAction from './action/OrderAction';
import { OrderAdminDto } from '@/types/order/order';
import { PaginationResponse } from '@/types/common/PaginationResponse';

const Order = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const { data, isLoading, isFetching, error, isError } = useQuery<
    PaginationResponse<OrderAdminDto>,
    Error
  >({
    queryKey: ['orders', page, pageSize],
    queryFn: () => getAllOrders(page - 1, pageSize),
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const orders: OrderAdminDto[] = data?.items ?? [];

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/30">
          <Spin size="large" />
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[880px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="w-[60px] px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  STT
                </TableCell>

                <TableCell
                  isHeader
                  className="w-[230px] px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  CUSTOMER
                </TableCell>

                <TableCell
                  isHeader
                  className="w-[110px] px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  STATUS
                </TableCell>

                <TableCell
                  isHeader
                  className="w-[140px] px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  TOTAL
                </TableCell>

                <TableCell
                  isHeader
                  className="w-[130px] px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  PAYMENT
                </TableCell>

                <TableCell
                  isHeader
                  className="w-[140px] px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  CREATED
                </TableCell>

                <TableCell
                  isHeader
                  className="w-[90px] px-3 py-2 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  ACTION
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {orders.length > 0 ? (
                orders.map((order: OrderAdminDto, index: number) => {
                  const products = order.products ?? [];

                  const totalPrice = products.reduce(
                    (total, product) =>
                      total + product.price * product.quantity,
                    0
                  );

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>

                      <TableCell className="px-3 py-3 text-start">
                        <div className="flex max-w-[220px] flex-col">
                          <span className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                            {order.fullName ?? 'Không có tên'}
                          </span>

                          <span className="truncate text-xs text-gray-500">
                            {order.email ?? 'Không có email'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-3 py-3 text-start text-sm">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-white/[0.08] dark:text-gray-300">
                          {order.status}
                        </span>
                      </TableCell>

                      <TableCell className="px-3 py-3 text-start text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                        {totalPrice.toLocaleString('vi-VN')} đ
                      </TableCell>

                      <TableCell className="px-3 py-3 text-start text-sm text-gray-700 dark:text-gray-300">
                        {order.paymentStatus}
                      </TableCell>

                      <TableCell className="px-3 py-3 text-start text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                        {formatTimeAgo(order.createdDate)}
                      </TableCell>

                      <TableCell className="px-3 py-3 text-start">
                        <OrderAction orderId={order.id} />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    Không có đơn hàng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end p-3">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={data?.totalItems ?? 0}
          showSizeChanger
          pageSizeOptions={['3', '5', '10', '20']}
          onChange={(newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          }}
        />
      </div>
    </div>
  );
};

export default Order;
