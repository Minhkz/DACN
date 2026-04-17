'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Loading from '@/components/common/Loading';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Product from '@/components/product/Product';
import { Modal } from '@/components/ui/modal';
import { getList } from '@/services/category/CategoryApi';
import { create } from '@/services/product/ProductApi';
import { notify } from '@/util/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

type ProductForm = {
  id?: number;
  name: string;
  description: string;
  price: string;
  quantity: number | '';
  sold: number;
  view: number;
  avatar: File | null;
  images: (File | null)[];
};

type FilterOption = {
  id: number;
  name: string;
  type: string;
};

type FormErrors = {
  name?: string;
  description?: string;
  price?: string;
  quantity?: string;
  avatar?: string;
  images?: string;
  filters?: string;
};

const ProductPageClient = () => {
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    quantity: 0,
    sold: 0,
    view: 0,
    avatar: null,
    images: [null],
  });

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, number | ''>
  >({});

  const [errors, setErrors] = useState<FormErrors>({});

  const getInputClass = (hasError?: string) =>
    `w-full rounded-lg border px-3 py-2 outline-none transition-colors ${
      hasError
        ? 'border-red-500 focus:border-red-500'
        : 'border-gray-300 focus:border-blue-500'
    }`;

  const getFileLabelClass = (hasError?: string) =>
    `flex w-full cursor-pointer items-center rounded-2xl border bg-white px-4 py-3 transition-colors ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

  const getSelectedFilterIds = () => {
    return Object.values(selectedFilters)
      .filter((value) => value !== '')
      .map((value) => Number(value));
  };

  const isValidImageFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return 'File phải là JPG, JPEG, PNG hoặc GIF';
    }

    if (file.size > maxSize) {
      return 'File không được vượt quá 5MB';
    }

    return '';
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    const filterIds = getSelectedFilterIds();
    const validImages = form.images.filter((file) => file !== null);

    if (!form.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    } else if (form.name.trim().length > 255) {
      newErrors.name = 'Tên sản phẩm phải nhỏ hơn 255 ký tự';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    } else if (form.description.trim().length > 500) {
      newErrors.description = 'Mô tả phải nhỏ hơn 500 ký tự';
    }

    if (form.price === '' || form.price === null || form.price === undefined) {
      newErrors.price = 'Giá không được để trống';
    } else if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    if (
      form.quantity === '' ||
      form.quantity === null ||
      form.quantity === undefined
    ) {
      newErrors.quantity = 'Số lượng không được để trống';
    } else if (Number(form.quantity) < 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn hoặc bằng 0';
    }

    if (!form.avatar) {
      newErrors.avatar = 'Ảnh đại diện là bắt buộc';
    }

    if (validImages.length > 10) {
      newErrors.images = 'Tối đa 10 ảnh';
    }

    if (filterIds.length === 0) {
      newErrors.filters = 'Vui lòng chọn ít nhất 1 filter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'quantity' || name === 'sold' || name === 'view'
          ? value === ''
            ? ''
            : Number(value)
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const message = isValidImageFile(file);
      if (message) {
        setErrors((prev) => ({
          ...prev,
          avatar: message,
        }));
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      avatar: file,
    }));

    setErrors((prev) => ({
      ...prev,
      avatar: '',
    }));
  };

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const message = isValidImageFile(file);
      if (message) {
        setErrors((prev) => ({
          ...prev,
          images: `Ảnh ${index + 1}: ${message}`,
        }));
        return;
      }
    }

    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[index] = file;

      return {
        ...prev,
        images: newImages,
      };
    });

    setErrors((prev) => ({
      ...prev,
      images: '',
    }));
  };

  const addImageField = () => {
    setForm((prev) => {
      if (prev.images.length >= 10) return prev;

      return {
        ...prev,
        images: [...prev.images, null],
      };
    });

    setErrors((prev) => ({
      ...prev,
      images: '',
    }));
  };

  const removeImageField = (index: number) => {
    setForm((prev) => {
      const updatedImages =
        prev.images.length === 1
          ? [null]
          : prev.images.filter((_, i) => i !== index);

      return {
        ...prev,
        images: updatedImages,
      };
    });

    setErrors((prev) => ({
      ...prev,
      images: '',
    }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      quantity: 0,
      sold: 0,
      view: 0,
      avatar: null,
      images: [null],
    });
    setSelectedFilters({});
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const createProduct = useMutation({
    mutationFn: (formData: FormData) => create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setOpen(false);
      resetForm();
      notify('success', 'Thêm sản phẩm thành công');
    },
    onError: () => {
      notify('error', 'Có lỗi xảy ra khi thêm sản phẩm');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();

    if (form.id) formData.append('id', String(form.id));
    formData.append('name', form.name.trim());
    formData.append('description', form.description.trim());
    formData.append('price', form.price);
    formData.append('quantity', String(Number(form.quantity)));
    formData.append('sold', String(form.sold));
    formData.append('view', String(form.view));

    if (form.avatar) {
      formData.append('avatar', form.avatar);
    }

    form.images.forEach((file) => {
      if (file) {
        formData.append('images', file);
      }
    });

    const filterIds = getSelectedFilterIds();
    filterIds.forEach((filterId) => {
      formData.append('filters', String(filterId));
    });

    createProduct.mutate(formData);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['filters-list'],
    queryFn: getList,
  });

  const filterOptions: FilterOption[] =
    data?.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
    })) || [];

  const groupedFilters = filterOptions.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<string, FilterOption[]>
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý sản phẩm" />

      <ComponentCard
        createModel={{
          visible: true,
          onCreate: () => setOpen(true),
        }}
      >
        <Product />
      </ComponentCard>

      <Modal isOpen={open} onClose={handleClose} className="max-w-lg">
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div className="p-6 text-red-500">Không tải được filters</div>
        ) : (
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Thêm sản phẩm</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={getInputClass(errors.name)}
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Mô tả</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className={getInputClass(errors.description)}
                  placeholder="Nhập mô tả"
                  rows={4}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Giá</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className={getInputClass(errors.price)}
                    placeholder="Nhập giá"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    className={getInputClass(errors.quantity)}
                    placeholder="Nhập số lượng"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.quantity}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Sold</label>
                  <input
                    type="number"
                    name="sold"
                    value={form.sold}
                    disabled
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">View</label>
                  <input
                    type="number"
                    name="view"
                    value={form.view}
                    disabled
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Avatar</label>

                <input
                  id="avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <label
                  htmlFor="avatar"
                  className={getFileLabelClass(errors.avatar)}
                >
                  <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                    Choose File
                  </span>
                  <span className="ml-4 truncate text-sm text-gray-700">
                    {form.avatar ? form.avatar.name : 'Chưa chọn file'}
                  </span>
                </label>

                <p className="mt-2 text-xs text-gray-500">
                  Chấp nhận: JPG, PNG, GIF (tối đa 5MB)
                </p>

                {errors.avatar && (
                  <p className="mt-1 text-sm text-red-500">{errors.avatar}</p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium">Images</label>
                  <button
                    type="button"
                    onClick={addImageField}
                    disabled={form.images.length >= 10}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={16} />
                    Thêm ảnh
                  </button>
                </div>

                <div className="space-y-2">
                  {form.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        id={`image-${index}`}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif"
                        onChange={(e) => handleImageChange(index, e)}
                        className="hidden"
                      />

                      <label
                        htmlFor={`image-${index}`}
                        className={`flex flex-1 cursor-pointer items-center rounded-2xl border bg-white px-4 py-3 transition-colors ${
                          errors.images ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                          Choose File
                        </span>
                        <span className="ml-4 truncate text-sm text-gray-700">
                          {image ? image.name : 'Chưa chọn file'}
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-white"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                {errors.images && (
                  <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Filters
                </label>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(groupedFilters).map(([type, items]) => (
                    <div key={type}>
                      <label className="mb-1 block text-sm font-medium capitalize">
                        {type}
                      </label>

                      <select
                        className={getInputClass(errors.filters)}
                        value={selectedFilters[type] || ''}
                        onChange={(e) => {
                          setSelectedFilters((prev) => ({
                            ...prev,
                            [type]: e.target.value
                              ? Number(e.target.value)
                              : '',
                          }));

                          setErrors((prev) => ({
                            ...prev,
                            filters: '',
                          }));
                        }}
                      >
                        <option value="">Chọn {type}</option>
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {errors.filters && (
                  <p className="mt-1 text-sm text-red-500">{errors.filters}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border px-4 py-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createProduct.isPending}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  {createProduct.isPending ? <Spin size="small" /> : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ProductPageClient;
