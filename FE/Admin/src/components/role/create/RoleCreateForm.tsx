'use client';

import { RoleCreate } from '@/types/role/create/RoleCreate';
import { RoleError } from '@/types/role/RoleError';

interface Props {
  form: RoleCreate;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error: RoleError;
}

export default function RoleCreateForm({ form, onChange, error }: Props) {
  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tên role
        </label>

        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Ví dụ: Người quản lý tài khoản"
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 ${
            error.name
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
        />

        {error.name && (
          <p className="mt-1 text-sm text-red-500">{error.name}</p>
        )}
      </div>

      {/* Code */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mã role
        </label>

        <input
          name="code"
          value={form.code}
          onChange={onChange}
          placeholder="ROLE_ADMIN_PRODUCT"
          className={`w-full rounded-lg border px-3 py-2 font-mono text-sm focus:ring-1 ${
            error.code
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
        />

        {error.code && (
          <p className="mt-1 text-sm text-red-500">{error.code}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mô tả
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={3}
          placeholder="Người sử dụng hệ thống"
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 ${
            error.description
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
        />

        {error.description && (
          <p className="mt-1 text-sm text-red-500">{error.description}</p>
        )}
      </div>
    </div>
  );
}
