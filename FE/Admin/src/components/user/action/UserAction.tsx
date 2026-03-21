'use client';

import { detail, remove, update } from '@/api/user/UserApi';
import { Modal } from '@/components/ui/modal';
import UserDetailType from '@/types/user/UserDetailType';
import UserUpdateRequest from '@/types/user/UserUpdateRequest';
import { notify } from '@/util/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { Eye, Trash2, Pencil } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

interface UserActionProps {
  userId: number;
}

const initialForm: UserUpdateRequest = {
  id: 0,
  username: '',
  email: '',
  phone: '',
  address: '',
  fullName: '',
  avatar: null,
};

const UserAction = ({ userId }: UserActionProps) => {
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [form, setForm] = useState<UserUpdateRequest>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const {
    data: userDetail,
    isPending: isPendingDetail,
    isError: isDetailError,
    error: detailError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => detail(userId),
    enabled: openView || openUpdate,
  });

  const removeUser = useMutation({
    mutationFn: () => remove(userId),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['users'] });
      setOpenDelete(false);
      notify('success', 'Thành công', 'Xóa người dùng thành công');
    },
    onError: (error: any) => {
      notify(
        'error',
        'Lỗi',
        error?.response?.data?.message || 'Xóa người dùng thất bại'
      );
    },
  });

  const updateUser = useMutation({
    mutationFn: (request: UserUpdateRequest) => update(userId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenUpdate(false);
      setErrors({});
      notify('success', 'Thành công', 'Cập nhật người dùng thành công');
    },
    onError: (error: any) => {
      notify(
        'error',
        'Lỗi',
        error?.response?.data?.message || 'Cập nhật người dùng thất bại'
      );
    },
  });

  useEffect(() => {
    if (openUpdate && userDetail) {
      setForm({
        id: userDetail.id,
        username: userDetail.username || '',
        email: userDetail.email || '',
        phone: userDetail.phone || '',
        address: userDetail.address || '',
        fullName: userDetail.fullName || '',
        avatar: null,
      });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openUpdate, userDetail]);

  const previewAvatar = useMemo(() => {
    if (form.avatar) {
      return URL.createObjectURL(form.avatar);
    }
    return userDetail?.avatar || '';
  }, [form.avatar, userDetail?.avatar]);

  useEffect(() => {
    return () => {
      if (previewAvatar && previewAvatar.startsWith('blob:')) {
        URL.revokeObjectURL(previewAvatar);
      }
    };
  }, [previewAvatar]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^0[0-9]{9}$/.test(form.phone)) {
      newErrors.phone = 'Phone must be 10 digits and start with 0';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (form.fullName.length > 100) {
      newErrors.fullName = 'Full name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    removeUser.mutate();
  };

  const handleSubmitUpdate = () => {
    if (!validate()) return;
    updateUser.mutate(form);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleCloseUpdate = () => {
    if (updateUser.isPending) return;
    setOpenUpdate(false);
    setErrors({});
    setForm(initialForm);
  };

  return (
    <div className="flex items-center gap-3">
      {/* View */}
      <button
        type="button"
        title="View"
        onClick={() => setOpenView(true)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <Eye size={18} />
      </button>

      {/* Update */}
      <button
        type="button"
        title="Update"
        onClick={() => setOpenUpdate(true)}
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

      {/* View Modal */}
      <Modal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        className="max-w-lg"
      >
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Chi tiết người dùng
          </h2>
        </div>

        {isPendingDetail ? (
          <div className="flex justify-center">
            <Spin size="large" />
          </div>
        ) : isDetailError ? (
          <p className="text-center text-sm text-red-500">
            {(detailError as any)?.response?.data?.message ||
              'Không tải được thông tin người dùng'}
          </p>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              {userDetail?.avatar ? (
                <Image
                  src={userDetail.avatar}
                  alt="avatar"
                  width={90}
                  height={90}
                  className="rounded-full border object-cover shadow"
                />
              ) : (
                <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-blue-500 text-2xl font-semibold text-white shadow">
                  {userDetail?.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            <div className="divide-y text-sm">
              <div className="flex justify-between py-2">
                <span className="text-gray-500">ID</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {userDetail?.id}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-gray-500">Username</span>
                <span className="font-medium">{userDetail?.username}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-gray-500">Full Name</span>
                <span className="font-medium">{userDetail?.fullName}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{userDetail?.email}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{userDetail?.phone}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-gray-500">Address</span>
                <span className="max-w-[60%] truncate text-right font-medium">
                  {userDetail?.address}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-gray-500">Role</span>
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                  {userDetail?.roleId}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setOpenView(false)}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95"
          >
            Đóng
          </button>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal
        isOpen={openUpdate}
        onClose={handleCloseUpdate}
        className="max-w-lg"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Cập nhật User
          </h2>
        </div>

        {isPendingDetail ? (
          <div className="flex justify-center">
            <Spin size="large" />
          </div>
        ) : isDetailError ? (
          <p className="text-center text-sm text-red-500">
            {(detailError as any)?.response?.data?.message ||
              'Không tải được thông tin người dùng'}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              {previewAvatar ? (
                <Image
                  src={previewAvatar}
                  alt="avatar preview"
                  width={90}
                  height={90}
                  className="rounded-full border object-cover shadow"
                />
              ) : (
                <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-blue-500 text-2xl font-semibold text-white shadow">
                  {form.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                name="username"
                disabled
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                name="email"
                disabled
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleCloseUpdate}
            disabled={updateUser.isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmitUpdate}
            disabled={updateUser.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {updateUser.isPending ? (
              <Spin size="small" style={{ color: '#fff' }} />
            ) : (
              'Cập nhật'
            )}
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={openDelete}
        onClose={() => !removeUser.isPending && setOpenDelete(false)}
        className="max-w-lg"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Xác nhận xóa User
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Bạn có chắc chắn muốn xóa user này không?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setOpenDelete(false)}
            disabled={removeUser.isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy
          </button>

          <button
            onClick={handleDelete}
            disabled={removeUser.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {removeUser.isPending ? (
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

export default UserAction;
