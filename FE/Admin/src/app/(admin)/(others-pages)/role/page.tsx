import { Metadata } from 'next';
import RolePageClient from './RolePageClient';

export const metadata: Metadata = {
  title: 'Quản lý roles',
  description: 'Trang quản lý roles',
};

export default function RolePage() {
  return <RolePageClient />;
}
