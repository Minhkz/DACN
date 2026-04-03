'use client';

import {
  create,
  detail,
  remove,
  update,
} from '@/services/category/CategoryApi';
import { Modal } from '@/components/ui/modal';
import { notify } from '@/util/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { Trash2, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CategoryActionProps {
  categoryId: number;
}

interface CategoryForm {
  name: string;
  type: string;
}

interface CategoryError {
  name?: string;
  type?: string;
}

const CategoryAction = ({ categoryId }: CategoryActionProps) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [form, setForm] = useState<CategoryForm>({
    name: '',
    type: '',
  });

  const [errors, setErrors] = useState<CategoryError>({});

  const queryClient = useQueryClient();

  const removeCtg = useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      notify('success', 'Xóa bộ lọc thành công');
      setOpenDelete(false);
    },
    onError: (error: Error) => {
      notify('error', `Xóa bộ lọc thất bại: ${error.message}`);
    },
  });

  const detailCtg = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => detail(categoryId),
    enabled: openUpdate,
  });

  const updateCategory = useMutation({
    mutationFn: (data: { id: number; name: string; type: string }) =>
      update(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
      notify('success', 'Cập nhật bộ lọc thành công');
      handleCloseOpen();
    },
    onError: (error: Error) => {
      notify('error', `Cập nhật bộ lọc thất bại: ${error.message}`);
    },
  });

  useEffect(() => {
    if (detailCtg.data && openUpdate) {
      setForm({
        name: detailCtg.data.name ?? '',
        type: detailCtg.data.type ?? '',
      });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailCtg.data, openUpdate]);

  const validate = () => {
    const newErrors: CategoryError = {};

    if (!form.name.trim()) {
      newErrors.name = 'Tên bộ lọc không được để trống';
    }

    if (!form.type.trim()) {
      newErrors.type = 'Loại bộ lọc không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCloseOpen = () => {
    setOpenUpdate(false);
    setForm({
      name: '',
      type: '',
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    updateCategory.mutate({
      id: categoryId,
      name: form.name.trim(),
      type: form.type.trim(),
    });
  };

  const handleDelete = () => {
    removeCtg.mutate(categoryId);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        title="Update"
        onClick={() => setOpenUpdate(true)}
        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
      >
        <Pencil size={18} />
      </button>

      <button
        type="button"
        title="Delete"
        onClick={() => setOpenDelete(true)}
        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        <Trash2 size={18} />
      </button>

      <Modal isOpen={openUpdate} onClose={handleCloseOpen} className="max-w-lg">
        <div className="p-6">
          <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white/90">
            Sửa bộ lọc
          </h2>

          {detailCtg.isLoading ? (
            <div className="flex justify-center py-6">
              <Spin />
            </div>
          ) : (
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
                  disabled={updateCategory.isPending}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateCategory.isPending ? (
                    <Spin size="small" style={{ color: '#fff' }} />
                  ) : (
                    'Lưu'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        className="max-w-lg"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Xác nhận xóa bộ lọc
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Bạn có chắc chắn muốn xóa bộ lọc này không?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setOpenDelete(false)}
            disabled={removeCtg.isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy
          </button>

          <button
            onClick={handleDelete}
            disabled={removeCtg.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {removeCtg.isPending ? (
              <Spin size="small" style={{ color: '#fff' }} />
            ) : (
              'Xóa'
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryAction;
