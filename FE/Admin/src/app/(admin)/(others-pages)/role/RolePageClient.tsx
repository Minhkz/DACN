'use client';

import { useRef, useState } from 'react';
import { RoleSubmit } from '@/types/role/RoleSubmit';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Role from '@/components/role/Role';
import { Modal } from '@/components/ui/modal';
import SkeletonForm from '@/components/ui/SkeletonForm';
import { dynamicWithDelay } from '@/util/dynamicWithDelay';
import { useRouter } from 'next/navigation';
import { notification } from 'antd';
import { notify } from '@/util/notify';

const RoleCreateFormContainer = dynamicWithDelay(
  () => import('@/components/role/create/RoleCreateFormContainer'),
  {
    delayMs: 8000,
    ssr: false,
    loading: () => <SkeletonForm />,
  }
);

export default function RolePageClient() {
  const [open, setOpen] = useState(false);
  const createBtn = useRef<RoleSubmit>(null);

  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý roles" />

      <ComponentCard
        title="Bảng roles"
        createModel={{
          visible: true,
          onCreate: () => setOpen(true),
        }}
      >
        <Role />
      </ComponentCard>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Tạo mới Role
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Khai báo quyền truy cập cho người dùng
          </p>
        </div>

        <RoleCreateFormContainer
          ref={createBtn}
          onSuccess={() => {
            setOpen(false);
            notify('success', 'Thông báo', 'Dữ liệu đã lưu');
          }}
          onError={(message: string) => {
            notify('error', 'Lỗi', message);
          }}
        />

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy
          </button>
          <button
            onClick={() => createBtn.current?.submit()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95"
          >
            Tạo
          </button>
        </div>
      </Modal>
    </>
  );
}
