import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import User from '@/components/user/User';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Next.js Profile | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

export default function Profile() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Quản lý người dùng" />
      <div className="space-y-6">
        <User />
      </div>
    </div>
  );
}
