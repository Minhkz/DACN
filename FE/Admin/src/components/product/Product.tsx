import React from 'react';
import Loading from '../common/Loading';
import { ProductDetailDto } from '@/types/product/ProductDetailDto';
import { getAll } from '@/api/product/ProductApi';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

const Product = () => {
  const { data, isLoading, isFetching, error, isError } = useQuery<
    ProductDetailDto[],
    Error
  >({
    queryKey: ['products'],
    queryFn: getAll,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (isLoading || isFetching) {
    return <Loading />;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
              {data && data.length > 0 ? (
                data.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell className="px-5 py-4">{index + 1}</TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {product.name}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {product.price?.toLocaleString('vi-VN')} đ
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {product.quantity}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">hi</TableCell>
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
    </div>
  );
};

export default Product;
