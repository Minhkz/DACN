import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import Loading from '../common/Loading';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import UserDetailType from '@/types/user/UserDetailType';
import UserAction from './action/UserAction';
import { Pagination, Spin } from 'antd';
import { getAll } from '@/services/user/UserApi';
import { PaginationResponse } from '@/types/common/PaginationResponse';

const User = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const { data, isLoading, isFetching, error, isError } = useQuery<
    PaginationResponse<UserDetailType[]>,
    Error
  >({
    queryKey: ['users', page, pageSize],
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

  const users = data?.items ?? [];

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
                  USERNAME
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  FULLNAME
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  ROLE
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
              {users.length > 0 ? (
                users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {user.username}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {user.fullName}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      {user.roleId}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      <UserAction userId={user.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-5 py-4 text-center" colSpan={5}>
                    Không có dữ liệu người dùng nào.
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

export default User;
