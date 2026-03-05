'use client';

import React, {
  forwardRef,
  use,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { detail, update } from '@/api/role/role';
import { RoleType } from '@/types/role/RoleTpye';
import { RoleError } from '@/types/role/RoleError';
import { notify } from '@/util/notify';
import RoleUpdateForm from './RoleUpdateForm';
import Loading from '@/components/common/Loading';
import { RoleSubmit } from '@/types/role/RoleSubmit';
import { useRouter } from 'next/navigation';
import { on } from 'events';

type Props = {
  roleId: number;
  onSuccess?: () => void;
};

const RoleUpdateFormContainer = forwardRef<RoleSubmit, Props>(
  ({ roleId, onSuccess }, ref) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
      queryKey: ['role-detail-update', roleId],
      queryFn: () => detail(roleId),
    });

    const [draft, setDraft] = useState<Partial<RoleType>>({});
    const [errors] = useState<RoleError>({});

    const form = useMemo<RoleType | null>(() => {
      if (!data) return null;
      return {
        ...data,
        ...draft,
      };
    }, [data, draft]);

    const updateMutation = useMutation({
      mutationFn: () => update(roleId, form!),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles'] });
        notify('success', 'Thành công', 'Cập nhật role thành công');
        router.push('/role');
        onSuccess?.();
      },
      onError: (err: any) =>
        notify('error', 'Lỗi', err?.response?.data?.message),
    });

    const submit = () => {
      if (!form) return;
      updateMutation.mutate();
    };

    useImperativeHandle(ref, () => ({ submit }));

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      setDraft((prev) => ({
        ...prev,
        [name]: name === 'isActive' ? value === 'true' : value,
      }));
    };

    if (isLoading || !form) return <Loading />;

    return (
      <>
        {updateMutation.isPending ? (
          <Loading />
        ) : (
          <RoleUpdateForm data={form} error={errors} onChange={handleChange} />
        )}
      </>
    );
  }
);

RoleUpdateFormContainer.displayName = 'RoleUpdateFormContainer';

export default RoleUpdateFormContainer;
