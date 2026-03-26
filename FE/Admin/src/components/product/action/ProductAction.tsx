'use client';

import { detail, remove, update } from '@/api/product/ProductApi';
import { getAll } from '@/api/category/CategoryApi';
import { Modal } from '@/components/ui/modal';
import { ModalProduct } from '@/components/ui/modal/ModalProduct';
import { notify } from '@/util/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface ProductActionProps {
  productId: number;
}

type ProductForm = {
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

const ProductAction = ({ productId }: ProductActionProps) => {
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

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
  const [oldAvatar, setOldAvatar] = useState<string>('');
  const [oldImages, setOldImages] = useState<string[]>([]);

  const queryClient = useQueryClient();

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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

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

  const getSelectedFilterIds = () => {
    return Object.values(selectedFilters)
      .filter((value) => value !== '')
      .map((value) => Number(value));
  };

  const resetUpdateForm = () => {
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
    setOldAvatar('');
    setOldImages([]);
  };

  const removeProduct = useMutation({
    mutationFn: () => remove(productId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['products'] });
      setOpenDelete(false);
      notify('success', 'Thành công', 'Xóa sản phẩm thành công');
    },
    onError: (error: any) => {
      notify(
        'error',
        'Lỗi',
        error?.response?.data?.message || 'Xóa sản phẩm thất bại'
      );
    },
  });

  const updateProduct = useMutation({
    mutationFn: (formData: FormData) => update(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setOpenUpdate(false);
      resetUpdateForm();
      notify('success', 'Thành công', 'Cập nhật sản phẩm thành công');
    },
    onError: (error: any) => {
      notify(
        'error',
        'Lỗi',
        error?.response?.data?.message || 'Cập nhật sản phẩm thất bại'
      );
    },
  });

  const handleDelete = () => {
    removeProduct.mutate();
  };

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => detail(productId),
    enabled: openView || openUpdate,
  });

  const { data: filterData, isLoading: isLoadingFilters } = useQuery({
    queryKey: ['filters'],
    queryFn: getAll,
    enabled: openUpdate,
  });

  const filterOptions: FilterOption[] = React.useMemo(
    () =>
      filterData?.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type,
      })) || [],
    [filterData]
  );

  const groupedFilters = React.useMemo(
    () =>
      filterOptions.reduce(
        (acc, item) => {
          if (!acc[item.type]) acc[item.type] = [];
          acc[item.type].push(item);
          return acc;
        },
        {} as Record<string, FilterOption[]>
      ),
    [filterOptions]
  );

  const allImages = product ? [product.avatar, ...(product.imgs || [])] : [];

  useEffect(() => {
    if (product?.avatar) setSelectedImage(product.avatar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.avatar]);

  useEffect(() => {
    if (!openUpdate || !product || filterOptions.length === 0) return;

    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ? String(product.price) : '',
      quantity: product.quantity ?? 0,
      sold: product.sold ?? 0,
      view: product.view ?? 0,
      avatar: null,
      images: [null],
    });

    setOldAvatar(product.avatar || '');
    setOldImages(product.imgs || []);

    const nextSelectedFilters: Record<string, number | ''> = {};

    filterOptions.forEach((option) => {
      const matched = product.filters?.find(
        (f: any) =>
          f?.id === option.id || f === option.name || f?.name === option.name
      );

      if (matched) {
        nextSelectedFilters[option.type] = option.id;
      }
    });

    setSelectedFilters(nextSelectedFilters);
    setErrors({});
  }, [openUpdate, product, filterOptions]);

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

    if (!oldAvatar && !form.avatar) {
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

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
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

    getSelectedFilterIds().forEach((filterId) => {
      formData.append('filters', String(filterId));
    });

    updateProduct.mutate(formData);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        title="View"
        onClick={() => setOpenView(true)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <Eye size={18} />
      </button>

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

      <ModalProduct
        isOpen={openView}
        onClose={() => setOpenView(false)}
        className="max-w-4xl"
      >
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : isError || !product ? (
          <div className="flex h-64 items-center justify-center text-sm text-red-500">
            Không thể tải thông tin sản phẩm.
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col gap-4 bg-gray-50 p-6 md:border-r md:border-gray-100 dark:bg-gray-800/60 md:dark:border-gray-700">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-700">
                  <img
                    src={selectedImage || product.avatar}
                    alt={product.name}
                    className="h-full w-full object-contain transition-opacity duration-200"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-medium text-white">
                    #{product.id}
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={[
                        'h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 p-[2px] transition-all duration-200',
                        selectedImage === img
                          ? 'border-indigo-500 opacity-100 shadow'
                          : 'border-transparent opacity-60 hover:opacity-90',
                      ].join(' ')}
                    >
                      <img
                        src={img}
                        alt={`thumb-${idx}`}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-5 p-6">
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-widest text-indigo-500 uppercase">
                    Sản phẩm
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {product.description}
                  </p>
                </div>

                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatPrice(product.price)}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Tồn kho', value: product.quantity },
                    { label: 'Đã bán', value: product.sold },
                    { label: 'Lượt xem', value: product.view },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-gray-100 bg-gray-50 py-3 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {value}
                      </span>
                      <span className="text-[10px] tracking-wide text-gray-400 uppercase">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {product.filters?.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                      Thuộc tính
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.filters.map((f: any, i: number) => (
                        <span
                          key={i}
                          className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                        >
                          {typeof f === 'string' ? f : f?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </ModalProduct>

      <Modal
        isOpen={openUpdate}
        onClose={() => {
          if (!updateProduct.isPending) {
            setOpenUpdate(false);
            resetUpdateForm();
          }
        }}
        className="max-w-3xl"
      >
        {isLoading || isLoadingFilters ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : isError || !product ? (
          <div className="flex h-64 items-center justify-center text-sm text-red-500">
            Không thể tải thông tin sản phẩm.
          </div>
        ) : (
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Cập nhật sản phẩm</h2>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Avatar hiện tại
                </label>
                {oldAvatar && (
                  <img
                    src={oldAvatar}
                    alt="old-avatar"
                    className="mb-3 h-24 w-24 rounded-xl border object-cover"
                  />
                )}

                <input
                  id={`avatar-update-${productId}`}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <label
                  htmlFor={`avatar-update-${productId}`}
                  className={getFileLabelClass(errors.avatar)}
                >
                  <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                    Choose File
                  </span>
                  <span className="ml-4 truncate text-sm text-gray-700">
                    {form.avatar ? form.avatar.name : 'Giữ avatar hiện tại'}
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
                <div className="mb-2">
                  <label className="block text-sm font-medium">
                    Ảnh hiện tại
                  </label>
                </div>

                {oldImages.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {oldImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`old-img-${index}`}
                        className="h-20 w-20 rounded-lg border object-cover"
                      />
                    ))}
                  </div>
                )}

                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium">Ảnh mới</label>
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
                        id={`image-update-${productId}-${index}`}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif"
                        onChange={(e) => handleImageChange(index, e)}
                        className="hidden"
                      />

                      <label
                        htmlFor={`image-update-${productId}-${index}`}
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
                  onClick={() => {
                    setOpenUpdate(false);
                    resetUpdateForm();
                  }}
                  disabled={updateProduct.isPending}
                  className="rounded-lg border px-4 py-2"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={updateProduct.isPending}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  {updateProduct.isPending ? <Spin size="small" /> : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={openDelete}
        onClose={() => !removeProduct.isPending && setOpenDelete(false)}
        className="max-w-lg"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Xác nhận xóa sản phẩm
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Bạn có chắc chắn muốn xóa sản phẩm này không?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setOpenDelete(false)}
            disabled={removeProduct.isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy
          </button>

          <button
            onClick={handleDelete}
            disabled={removeProduct.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {removeProduct.isPending ? (
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

export default ProductAction;
