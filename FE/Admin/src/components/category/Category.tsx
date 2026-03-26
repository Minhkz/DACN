import React from 'react';
import Loading from '../common/Loading';
import { CategoryType } from '@/types/category/CategoryType';
import { getAll } from '@/api/category/CategoryApi';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import CategoryAction from './action/CategoryAction';

const Category = () => {
  const {
    data = [],
    isLoading,
    error,
    isError,
    isFetching,
  } = useQuery<CategoryType[], Error>({
    queryKey: ['categories'],
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
              {data.length > 0 ? (
                data.map((category, index) => (
                  <TableRow key={category.id ?? `category-${index}`}>
                    <TableCell className="px-5 py-4">{index + 1}</TableCell>

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
    </div>
  );
};

export default Category;
