'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Product from '@/components/product/Product';
import { Modal } from '@/components/ui/modal';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';
type ProductForm = {
  id?: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  sold: number;
  view: number;
  avatar: File | null;
  images: (File | null)[];
  filters: number[];
};
const ProductPageClient = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    quantity: 0,
    sold: 0,
    view: 0,
    avatar: null,
    images: [null],
    filters: [],
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'quantity' || name === 'sold' || name === 'view'
          ? Number(value)
          : value,
    }));
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const addImageField = () => {
    setForm((prev) => {
      if (prev.images.length >= 10) return prev;
      return {
        ...prev,
        images: [...prev.images, null],
      };
    });
  };

  const removeImageField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images:
        prev.images.length === 1
          ? [null]
          : prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFilterChange = (id: number) => {
    setForm((prev) => ({
      ...prev,
      filters: prev.filters.includes(id)
        ? prev.filters.filter((item) => item !== id)
        : [...prev.filters, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (form.id) formData.append('id', String(form.id));
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('quantity', String(form.quantity));
    formData.append('sold', String(form.sold));
    formData.append('view', String(form.view));

    if (form.avatar) {
      formData.append('avatar', form.avatar);
    }

    form.images.forEach((file) => {
      if (file) formData.append('images', file);
    });

    form.filters.forEach((filterId) => {
      formData.append('filters', String(filterId));
    });

    console.log('submit');
    // gọi api ở đây
  };

  const filterOptions = [
    { id: 1, name: 'Size M' },
    { id: 2, name: 'Size L' },
    { id: 3, name: 'Red' },
    { id: 4, name: 'Blue' },
  ];
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
      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg">
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
                className="w-full rounded-lg border px-3 py-2 outline-none"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 outline-none"
                placeholder="Nhập mô tả"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Giá</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 outline-none"
                  placeholder="Nhập giá"
                />
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
                  className="w-full rounded-lg border px-3 py-2 outline-none"
                  placeholder="Nhập số lượng"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Sold</label>
                <input
                  type="number"
                  name="sold"
                  value={form.sold}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">View</label>
                <input
                  type="number"
                  name="view"
                  value={form.view}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 outline-none"
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
                className="flex w-full cursor-pointer items-center rounded-2xl border border-gray-300 bg-white px-4 py-3"
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
                      className="flex flex-1 cursor-pointer items-center rounded-2xl border border-gray-300 bg-white px-4 py-3"
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Filters</label>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={form.filters.includes(filter.id)}
                      onChange={() => handleFilterChange(filter.id)}
                    />
                    <span>{filter.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border px-4 py-2"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Lưu sản phẩm
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ProductPageClient;
