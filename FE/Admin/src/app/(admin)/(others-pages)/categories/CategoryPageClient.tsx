'use client';

import Category from '@/components/category/Category';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Modal } from '@/components/ui/modal';
import { create } from '@/services/category/CategoryApi';
import { notify } from '@/util/notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import React, { useState } from 'react';

type FilterForm = {
  name: string;
  type: string;
};

type FilterFormErrors = {
  name?: string;
  type?: string;
};

const FilterPageClient = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<FilterForm>({
    name: '',
    type: '',
  });
  const [errors, setErrors] = useState<FilterFormErrors>({});

  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validate = () => {
    const newErrors: FilterFormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Tên bộ lọc không được để trống';
    } else if (form.name.trim().length > 100) {
      newErrors.name = 'Tên bộ lọc tối đa 100 ký tự';
    }

    if (!form.type.trim()) {
      newErrors.type = 'Loại bộ lọc không được để trống';
    } else if (form.type.trim().length > 50) {
      newErrors.type = 'Loại bộ lọc tối đa 50 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseOpen = () => {
    setOpen(false);
    setForm({
      name: '',
      type: '',
    });
    setErrors({});
  };

  const createCategory = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      notify('success', 'Thành công', `Tạo thành công bộ lọc ${form.name}`);
      handleCloseOpen();
    },
    onError: (error: Error) => {
      notify('error', 'Lỗi', `Có lỗi xảy ra khi tạo bộ lọc: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    createCategory.mutate({
      ...form,
      name: form.name.trim(),
      type: form.type.trim(),
    });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý bộ lọc" />

      <ComponentCard
        createModel={{
          visible: true,
          onCreate: () => setOpen(true),
        }}
      >
        <Category />
      </ComponentCard>

      <Modal isOpen={open} onClose={handleCloseOpen} className="max-w-lg">
        <div className="p-6">
          <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white/90">
            Thêm bộ lọc
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên bộ lọc
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên bộ lọc"
                className={`h-11 w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-white ${
                  errors.name
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loại bộ lọc
              </label>
              <input
                type="text"
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="Ví dụ: color, size, brand"
                className={`h-11 w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-white ${
                  errors.type
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">{errors.type}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseOpen}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={createCategory.isPending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createCategory.isPending ? (
                  <Spin size="small" style={{ color: '#fff' }} />
                ) : (
                  'Lưu'
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default FilterPageClient;
