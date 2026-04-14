import React, { useState } from 'react';
import Loading from '../common/Loading';
import { CategoryType } from '@/types/category/CategoryType';
import { getAll } from '@/services/category/CategoryApi';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import CategoryAction from './action/CategoryAction';
import { Pagination, Spin } from 'antd';
import { PaginationResponse } from '@/types/common/PaginationResponse';

const Category = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const { data, isLoading, isFetching, error, isError } = useQuery<
    PaginationResponse<CategoryType[]>,
    Error
  >({
    queryKey: ['categories', page, pageSize],
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

  const categories = data?.items ?? [];

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
                  TYPE
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
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <TableRow key={category.id ?? `category-${index}`}>
                    <TableCell className="px-5 py-4">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {category.name}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {category.type}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      <CategoryAction categoryId={category.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-5 py-4 text-center" colSpan={4}>
                    Không có dữ liệu danh mục nào.
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
            if (newPageSize !== pageSize) {
              setPage(1);
            } else {
              setPage(newPage);
            }
            setPageSize(newPageSize);
          }}
        />
      </div>
    </div>
  );
};

export default Category;
