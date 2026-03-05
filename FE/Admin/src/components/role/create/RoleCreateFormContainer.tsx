'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleError } from '@/types/role/RoleError';
import { RoleCreate } from '@/types/role/create/RoleCreate';
import { RoleSubmit } from '@/types/role/RoleSubmit';
import RoleCreateForm from './RoleCreateForm';
import { create } from '@/api/role/role';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/Loading';

interface RoleCreateFormContainerProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const RoleCreateFormContainer = forwardRef<
  RoleSubmit,
  RoleCreateFormContainerProps
>(({ onSuccess, onError }, ref) => {
  const [form, setForm] = useState<RoleCreate>({
    name: '',
    code: 'ROLE_',
    description: '',
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const [errors, setErrors] = useState<RoleError>({});

  const { mutate, isPending, isError, error, data } = useMutation({
    mutationFn: create,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      router.push('/role');
      setForm({
        name: '',
        code: 'ROLE_',
        description: '',
      });
      onSuccess?.();
    },

    onError: (error: any) => {
      onError?.(
        error?.response?.data?.message ||
          'Something went wrong, please try again.'
      );
    },
  });

  const validate = (): boolean => {
    const newErrors: RoleError = {};

    if (!form.name.trim()) {
      newErrors.name = 'Tên role không được để trống';
    }

    if (!form.code.trim()) {
      newErrors.code = 'Mã role không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    mutate(form);
  };

  useImperativeHandle(ref, () => ({
    submit,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <>
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <Loading />
        </div>
      )}
      <RoleCreateForm form={form} error={errors} onChange={handleChange} />
    </>
  );
});

RoleCreateFormContainer.displayName = 'RoleCreateFormContainer';

export default RoleCreateFormContainer;
