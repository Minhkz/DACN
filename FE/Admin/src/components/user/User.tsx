import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import Loading from '../common/Loading';
import { useQuery } from '@tanstack/react-query';
import UserDetailType from '@/types/user/UserDetailType';

import Image from 'next/image';
import UserAction from './action/UserAction';
import { Spin } from 'antd';
import { getAll } from '@/services/user/UserApi';

const User = () => {
  const { data, isLoading, error, isError, isFetching } = useQuery<
    UserDetailType[]
  >({
    queryKey: ['users'],
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
              {/* rows */}
              {data?.length ? (
                data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4">
                      {data?.indexOf(user) + 1}
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
    </div>
  );
};

export default User;
