import React from 'react';
import { RoleType } from '@/types/role/RoleTpye';
import { RoleError } from '@/types/role/RoleError';

interface Props {
  data: RoleType;
  error: RoleError;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

const RoleUpdateForm: React.FC<Props> = ({ data, error, onChange }) => {
  return (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tên role
        </label>
        <input
          value={data.name}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        />
      </div>

      {/* Code */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mã role
        </label>
        <input
          value={data.code}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mô tả
        </label>
        <textarea
          name="description"
          value={data.description ?? ''}
          onChange={onChange}
          rows={3}
          placeholder="Nhập mô tả role..."
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none ${
            error.description
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-200 dark:border-gray-700'
          } dark:bg-gray-900 dark:text-white`}
        />
        {error.description && (
          <p className="mt-1 text-xs text-red-500">{error.description}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Trạng thái
        </label>
        <select
          name="isActive"
          value={data.isActive ? 'true' : 'false'}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default RoleUpdateForm;
