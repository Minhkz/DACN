'use client';
import React, { ChangeEvent, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Modal } from '@/components/ui/modal';
import User from '@/components/user/User';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from '@/api/user/UserApi';
import { notify } from '@/util/notify';
import { Spin } from 'antd';

type FormErrorsType = Partial<Record<keyof UserRequest, string>>;

const initialForm: UserRequest = {
  username: '',
  fullName: '',
  password: '',
  email: '',
  phone: '',
  address: '',
  roleId: '',
  avatar: null,
};

const UserPageClient = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserRequest>(initialForm);
  const [errors, setErrors] = useState<FormErrorsType>({});
  const queryClient = useQueryClient();

  const handleCloseModal = (): void => {
    setOpen(false);
    setFormData(initialForm);
    setErrors({});
  };

  const handleCloseModalError = (): void => {
    setOpen(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const file = e.target.files?.[0] ?? null;

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = (): FormErrorsType => {
    const newErrors: FormErrorsType = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 4 || formData.username.length > 50) {
      newErrors.username = 'Tên đăng nhập phải từ 4 đến 50 ký tự';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải gồm 10 số và bắt đầu bằng 0';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Vui lòng chọn vai trò';
    }

    if (formData.avatar) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(formData.avatar.type)) {
        newErrors.avatar = 'Chỉ chấp nhận file JPG, PNG, GIF';
      } else if (formData.avatar.size > maxSize) {
        newErrors.avatar = 'Dung lượng ảnh tối đa 5MB';
      }
    }

    return newErrors;
  };

  const createUsser = useMutation({
    mutationFn: create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseModal();
      notify(
        'success',
        'Thành công',
        `Tạo thành công người dùng: ${data.username}`
      );
    },
    onError: (error) => {
      handleCloseModalError();
      notify('error', 'Lỗi', `${error.name}: ${error.message}`);
    },
  });

  const handleSubmit = (): void => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createUsser.mutate(formData);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý người dùng" />

      <ComponentCard
        createModel={{
          visible: true,
          onCreate: () => setOpen(true),
        }}
      >
        <User />
      </ComponentCard>

      <Modal isOpen={open} onClose={handleCloseModal} className="max-w-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Tạo mới người dùng
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              className={`w-full rounded-lg border px-3 py-2 focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                errors.username
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Tối thiểu 4, tối đa 50 ký tự
            </p>
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className={`w-full rounded-lg border px-3 py-2 focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className={`w-full rounded-lg border px-3 py-2 focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                errors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">Tối thiểu 6 ký tự</p>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={`w-full rounded-lg border px-3 py-2 focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123456789"
              className={`w-full rounded-lg border px-3 py-2 focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">10 số, bắt đầu bằng 0</p>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className={`w-full rounded-lg border px-3 py-2 focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                errors.address
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Vai trò <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className={`w-full appearance-none rounded-xl bg-white px-4 py-3 pr-10 text-sm text-gray-800 shadow-sm transition-all duration-200 outline-none dark:bg-gray-900 dark:text-white ${
                  errors.roleId
                    ? 'border border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-red-500'
                    : 'border border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:hover:border-blue-500 dark:focus:ring-blue-900/30'
                }`}
              >
                <option value="" disabled>
                  Chọn vai trò
                </option>
                <option value="1">Admin</option>
                <option value="2">User</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {errors.roleId && (
              <p className="mt-1 text-xs text-red-500">{errors.roleId}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ảnh đại diện
            </label>
            <input
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:file:bg-gray-700 dark:file:text-gray-300 ${
                errors.avatar
                  ? 'border-red-500 file:bg-red-50 file:text-red-700'
                  : 'border-gray-300 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Chấp nhận: JPG, PNG, GIF (tối đa 5MB)
            </p>
            {errors.avatar && (
              <p className="mt-1 text-xs text-red-500">{errors.avatar}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleCloseModal}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={createUsser.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {createUsser.isPending ? (
              <Spin size="small" style={{ color: '#fff' }} />
            ) : (
              'Tạo'
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default UserPageClient;
