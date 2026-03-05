'use client';

import React, { use, useRef, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { detail, remove } from '@/api/role/role';
import Loading from '@/components/common/Loading';
import { RoleType } from '@/types/role/RoleTpye';
import { notify } from '@/util/notify';
import { RoleSubmit } from '@/types/role/RoleSubmit';
import dynamic from 'next/dynamic';
import SkeletonForm from '@/components/ui/SkeletonForm';
import { dynamicWithDelay } from '@/util/dynamicWithDelay';
import RoleViewForm from '../view/RoleViewForm';
import RoleUpdateFormContainer from '../update/RoleUpdateFormContainer';

interface RoleActionProps {
  roleId: number;
}

const RoleAction: React.FC<RoleActionProps> = ({ roleId }) => {
  const [openView, setOpenView] = React.useState(false);
  const [dataView, setDataView] = useState<RoleType>();

  const [openUpdate, setOpenUpdate] = useState(false);
  const updateRef = useRef<RoleSubmit>(null);

  const [openDelete, setOpenDelete] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: () => detail(roleId),
    onSuccess: (data) => {
      setDataView(data);
    },
    onError: (error: any) => {
      notify('error', 'Lỗi', error?.response?.data?.message);
    },
  });

  const deleteRole = useMutation({
    mutationFn: () => {
      return remove(roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      notify('success', 'Thông báo', 'Role đã được xóa');
      setOpenDelete(false);
    },
    onError: (error: any) => {
      notify('error', 'Lỗi', error?.response?.data?.message);
    },
  });

  const handleView = () => {
    setOpenView(true);
    mutate();
  };

  const handleClickUpdate = () => {
    setOpenUpdate(true);
  };

  const handleDelete = () => {
    setOpenDelete(true);
    deleteRole.mutate();
  };

  return (
    <div className="flex items-center gap-3">
      {/* View */}
      <button
        type="button"
        title="View"
        onClick={() => handleView()}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <Eye size={18} />
      </button>

      {/* Update */}
      <button
        type="button"
        title="Update"
        onClick={() => handleClickUpdate()}
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

      {/* View */}
      <Modal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        className="max-w-lg"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Xem chi tiết Role
          </h2>
        </div>
        {/* Main */}
        {isPending ? <Loading /> : <RoleViewForm data={dataView} />}
        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setOpenView(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95"
          >
            Đóng
          </button>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal
        isOpen={openUpdate}
        onClose={() => setOpenUpdate(false)}
        className="max-w-lg"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Cập nhật Role
          </h2>
        </div>
        {/* Main */}
        <RoleUpdateFormContainer
          roleId={roleId}
          ref={updateRef}
          onSuccess={() => {
            setOpenUpdate(false);
          }}
        />
        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setOpenUpdate(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95"
            onClick={() => updateRef.current?.submit()}
          >
            Cập nhật
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        className="max-w-lg"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Xác nhận xóa Role
          </h2>
        </div>
        {/* Main */}
        {deleteRole.isPending ? (
          <Loading />
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            Bạn có chắc chắn muốn xóa Role này không?
          </p>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setOpenDelete(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy
          </button>
          <button
            onClick={() => handleDelete()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95"
          >
            Xóa
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RoleAction;
