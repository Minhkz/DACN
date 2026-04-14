import React, { useState } from 'react';
import Loading from '../common/Loading';
import { ProductDetailDto } from '@/types/product/ProductDetailDto';
import { getAll } from '@/services/product/ProductApi';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import ProductAction from './action/ProductAction';
import { Pagination, Spin } from 'antd';
import { PaginationResponse } from '@/types/common/PaginationResponse';

const Product = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const { data, isLoading, isFetching, error, isError } = useQuery<
    PaginationResponse<ProductDetailDto[]>,
    Error
  >({
    queryKey: ['products', page, pageSize],
    queryFn: () => getAll(page - 1, pageSize),
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

  const products = data?.items ?? [];

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/30">
          <Spin size="large" />
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  STT
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  NAME
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  PRICE
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  QUANTITY
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  ACTION
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell className="px-5 py-4">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {product.name}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {product.price?.toLocaleString('vi-VN')} đ
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {product.quantity}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      <ProductAction productId={product.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-5 py-4 text-center" colSpan={5}>
                    Không có dữ liệu sản phẩm nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end p-4">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={data?.totalItems || 0}
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

export default Product;
