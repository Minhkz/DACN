import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Order from '@/components/order/Order';
import React from 'react';

const OrderPageClient = () => {
  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý đơn hàng" />

      <ComponentCard>
        <Order />
      </ComponentCard>
    </>
  );
};

export default OrderPageClient;
