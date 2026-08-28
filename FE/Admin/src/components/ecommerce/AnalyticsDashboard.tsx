'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Eye,
  ShoppingCart,
  AlertTriangle,
  RefreshCw,
  Package,
} from 'lucide-react';

import {
  getAbandonedCarts,
  getCartAdditions,
  getProductViews,
} from '@/services/analytics/AnalyticsApi';

import {
  AbandonedCartDto,
  CartAdditionStatsDto,
  ProductViewStatsDto,
} from '@/types/analytics/analytics';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatDateTime = (value: string | null) => {
  if (!value) return 'Chưa có hoạt động';

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
};

const shortName = (name: string, max = 22) => {
  if (!name) return '';
  return name.length > max ? `${name.slice(0, max)}...` : name;
};

const COLORS = ['#2563eb', '#16a34a', '#f97316', '#dc2626', '#7c3aed'];

const AnalyticsDashboard = () => {
  const [limit, setLimit] = useState(10);
  const [hours, setHours] = useState(24);

  const productViewsQuery = useQuery<ProductViewStatsDto[]>({
    queryKey: ['analytics-product-views', limit],
    queryFn: () => getProductViews(limit),
  });

  const cartAdditionsQuery = useQuery<CartAdditionStatsDto[]>({
    queryKey: ['analytics-cart-additions', limit],
    queryFn: () => getCartAdditions(limit),
  });

  const abandonedCartsQuery = useQuery<AbandonedCartDto[]>({
    queryKey: ['analytics-abandoned-carts', hours],
    queryFn: () => getAbandonedCarts(hours),
  });

  const productViews = productViewsQuery.data || [];
  const cartAdditions = cartAdditionsQuery.data || [];
  const abandonedCarts = abandonedCartsQuery.data || [];

  const totalViews = useMemo(() => {
    return productViews.reduce((sum, item) => sum + item.viewCount, 0);
  }, [productViews]);

  const totalAddToCart = useMemo(() => {
    return cartAdditions.reduce((sum, item) => sum + item.addToCartCount, 0);
  }, [cartAdditions]);

  const totalQuantity = useMemo(() => {
    return cartAdditions.reduce((sum, item) => sum + item.totalQuantity, 0);
  }, [cartAdditions]);

  const totalAbandonedAmount = useMemo(() => {
    return abandonedCarts.reduce((sum, item) => sum + item.totalAmount, 0);
  }, [abandonedCarts]);

  const productViewChartData = productViews.map((item) => ({
    name: shortName(item.productName),
    fullName: item.productName,
    views: item.viewCount,
  }));

  const cartAdditionChartData = cartAdditions.map((item) => ({
    name: shortName(item.productName),
    fullName: item.productName,
    addCount: item.addToCartCount,
    quantity: item.totalQuantity,
  }));

  const circleData = [
    {
      name: 'Lượt xem',
      value: totalViews,
    },
    {
      name: 'Thêm giỏ',
      value: totalAddToCart,
    },
    {
      name: 'Giỏ bỏ quên',
      value: abandonedCarts.length,
    },
  ];

  const isFetching =
    productViewsQuery.isFetching ||
    cartAdditionsQuery.isFetching ||
    abandonedCartsQuery.isFetching;

  const refetchAll = () => {
    productViewsQuery.refetch();
    cartAdditionsQuery.refetch();
    abandonedCartsQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]/80" style={{ padding: '24px' }}>
      {/* ===== Top Header Row ===== */}
      <div
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Phân tích hành vi người dùng
          </h1>
          <p
            className="text-sm leading-relaxed text-slate-500"
            style={{ marginTop: '6px' }}
          >
            Theo dõi lượt xem sản phẩm, hành vi thêm giỏ hàng và giỏ hàng bị bỏ
            quên.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SelectBox
            label="Top"
            value={limit}
            onChange={setLimit}
            options={[
              { label: '5 sản phẩm', value: 5 },
              { label: '10 sản phẩm', value: 10 },
              { label: '20 sản phẩm', value: 20 },
            ]}
          />

          <SelectBox
            label="Bỏ quên sau"
            value={hours}
            onChange={setHours}
            options={[
              { label: '0 giờ', value: 0 },
              { label: '1 giờ', value: 1 },
              { label: '12 giờ', value: 12 },
              { label: '24 giờ', value: 24 },
              { label: '48 giờ', value: 48 },
            ]}
          />

          {/* <button
            onClick={refetchAll}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-[0_4px_12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:bg-slate-800 hover:shadow-[0_6px_20px_rgba(15,23,42,0.2)] active:scale-[0.98]"
            style={{ padding: '10px 16px' }}
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            Làm mới
          </button> */}
        </div>
      </div>

      {/* ===== Stats Cards Row ===== */}
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        style={{ marginBottom: '28px' }}
      >
        <CircleStatCard
          title="Tổng lượt xem"
          value={totalViews}
          suffix="view"
          icon={<Eye size={20} />}
          color="#2563eb"
          percent={Math.min(totalViews * 10, 100)}
        />

        <CircleStatCard
          title="Lượt thêm giỏ"
          value={totalAddToCart}
          suffix="lần"
          icon={<ShoppingCart size={20} />}
          color="#16a34a"
          percent={Math.min(totalAddToCart * 10, 100)}
        />

        <CircleStatCard
          title="Tổng số lượng thêm"
          value={totalQuantity}
          suffix="sp"
          icon={<Package size={20} />}
          color="#f97316"
          percent={Math.min(totalQuantity * 10, 100)}
        />

        <CircleStatCard
          title="Giỏ hàng bỏ quên"
          value={abandonedCarts.length}
          suffix="giỏ"
          icon={<AlertTriangle size={20} />}
          color="#dc2626"
          percent={Math.min(abandonedCarts.length * 20, 100)}
          subText={formatCurrency(totalAbandonedAmount)}
        />
      </div>

      {/* ===== Charts Section 1 ===== */}
      <div
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
        style={{ marginBottom: '28px' }}
      >
        <div className="xl:col-span-2">
          <ChartCard title="Top sản phẩm được xem nhiều">
            <BarChartView
              data={productViewChartData}
              dataKey="views"
              barName="Lượt xem"
              color="#2563eb"
              isLoading={productViewsQuery.isLoading}
              isError={productViewsQuery.isError}
            />
          </ChartCard>
        </div>

        <ChartCard title="Tỉ lệ tổng quan">
          <SummaryPieChart data={circleData} />
        </ChartCard>
      </div>

      {/* ===== Charts Section 2 ===== */}
      <div
        className="grid grid-cols-1 gap-6 xl:grid-cols-2"
        style={{ marginBottom: '28px' }}
      >
        <ChartCard title="Top sản phẩm được thêm vào giỏ">
          <BarChartView
            data={cartAdditionChartData}
            dataKey="addCount"
            barName="Số lần thêm"
            color="#16a34a"
            isLoading={cartAdditionsQuery.isLoading}
            isError={cartAdditionsQuery.isError}
          />
        </ChartCard>

        <ChartCard title="Tổng số lượng sản phẩm thêm vào giỏ">
          <BarChartView
            data={cartAdditionChartData}
            dataKey="quantity"
            barName="Tổng số lượng"
            color="#f97316"
            isLoading={cartAdditionsQuery.isLoading}
            isError={cartAdditionsQuery.isError}
          />
        </ChartCard>
      </div>

      {/* ===== Bottom Abandoned Table ===== */}
      <AbandonedCartSection
        data={abandonedCarts}
        isLoading={abandonedCartsQuery.isLoading}
        isError={abandonedCartsQuery.isError}
      />
    </div>
  );
};

export default AnalyticsDashboard;

type SelectBoxProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: {
    label: string;
    value: number;
  }[];
};

const SelectBox = ({ label, value, onChange, options }: SelectBoxProps) => {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white shadow-sm">
      <span
        className="text-sm font-medium text-slate-600"
        style={{ paddingLeft: '12px' }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-transparent text-sm font-medium text-slate-900 outline-none"
        style={{ padding: '10px 12px' }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

type CircleStatCardProps = {
  title: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
  percent: number;
  subText?: string;
};

const CircleStatCard = ({
  title,
  value,
  suffix,
  icon,
  color,
  percent,
  subText,
}: CircleStatCardProps) => {
  const chartData = [
    { name: 'done', value: percent },
    { name: 'left', value: 100 - percent },
  ];

  return (
    <div
      className="rounded-3xl border border-slate-200 bg-white shadow-sm"
      style={{ padding: '20px' }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

        <div className="h-20 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={26}
                outerRadius={38}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill={color} />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className="flex items-end gap-2" style={{ marginTop: '8px' }}>
          <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
          <span
            className="text-sm font-semibold text-slate-500"
            style={{ marginBottom: '4px' }}
          >
            {suffix}
          </span>
        </div>

        {subText && (
          <p
            className="text-sm font-semibold text-red-600"
            style={{ marginTop: '8px' }}
          >
            {subText}
          </p>
        )}
      </div>
    </div>
  );
};

type ChartCardProps = {
  title: string;
  children: React.ReactNode;
};

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div
        className="flex items-center justify-between border-b border-slate-100"
        style={{ padding: '18px 20px' }}
      >
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>

      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );
};

type BarChartViewProps = {
  data: any[];
  dataKey: string;
  barName: string;
  color: string;
  isLoading: boolean;
  isError: boolean;
};

const BarChartView = ({
  data,
  dataKey,
  barName,
  color,
  isLoading,
  isError,
}: BarChartViewProps) => {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data.length) return <EmptyState />;

  return (
    <div style={{ width: '100%', height: '320px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-30}
            textAnchor="end"
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [value, barName]}
            labelFormatter={(_, payload) => {
              return payload?.[0]?.payload?.fullName || '';
            }}
          />
          <Bar
            dataKey={dataKey}
            name={barName}
            fill={color}
            radius={[8, 8, 0, 0]}
            barSize={34}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

type SummaryPieChartProps = {
  data: {
    name: string;
    value: number;
  }[];
};

const SummaryPieChart = ({ data }: SummaryPieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
      <div style={{ width: '100%', height: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-2xl bg-slate-50"
            style={{ padding: '12px' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium text-slate-600">
                {item.name}
              </span>
            </div>

            <span className="text-sm font-bold text-slate-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

type AbandonedCartSectionProps = {
  data: AbandonedCartDto[];
  isLoading: boolean;
  isError: boolean;
};

const AbandonedCartSection = ({
  data,
  isLoading,
  isError,
}: AbandonedCartSectionProps) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div
        className="flex items-center justify-between border-b border-slate-100"
        style={{ padding: '18px 20px' }}
      >
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Giỏ hàng bị bỏ quên
          </h2>
          <p className="text-sm text-slate-500" style={{ marginTop: '4px' }}>
            Danh sách khách hàng còn sản phẩm trong giỏ nhưng chưa đặt hàng.
          </p>
        </div>

        <span className="rounded-full bg-red-50 text-sm font-semibold text-red-600">
          <span style={{ padding: '6px 12px', display: 'inline-block' }}>
            {data.length} giỏ
          </span>
        </span>
      </div>

      <div style={{ padding: '20px' }}>
        {isLoading && <LoadingState />}
        {isError && <ErrorState />}
        {!isLoading && !isError && data.length === 0 && <EmptyState />}

        {!isLoading && !isError && data.length > 0 && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {data.map((cart) => (
              <AbandonedCartCard key={cart.cartId} cart={cart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

type AbandonedCartCardProps = {
  cart: AbandonedCartDto;
};

const AbandonedCartCard = ({ cart }: AbandonedCartCardProps) => {
  return (
    <div
      className="rounded-3xl border border-slate-200 bg-slate-50"
      style={{ padding: '16px' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">
            {cart.fullName || cart.username}
          </h3>
          <p className="text-sm text-slate-500" style={{ marginTop: '4px' }}>
            {cart.email}
          </p>
          <p className="text-xs text-slate-400" style={{ marginTop: '4px' }}>
            Cart #{cart.cartId} - User #{cart.userId}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-red-600">
            {formatCurrency(cart.totalAmount)}
          </p>
          <p className="text-xs text-slate-500" style={{ marginTop: '4px' }}>
            {formatDateTime(cart.lastCartActivity)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3" style={{ marginTop: '16px' }}>
        {cart.items.map((item) => (
          <div
            key={`${cart.cartId}-${item.productId}`}
            className="flex items-center gap-3 rounded-2xl bg-white"
            style={{ padding: '10px' }}
          >
            <ProductImage src={item.productAvatar} alt={item.productName} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {item.productName}
              </p>
              <p
                className="text-xs text-slate-500"
                style={{ marginTop: '4px' }}
              >
                SL: {item.quantity} - {formatCurrency(item.price)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">
                {formatCurrency(item.subTotal)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type ProductImageProps = {
  src: string;
  alt: string;
};

const ProductImage = ({ src, alt }: ProductImageProps) => {
  return (
    <img
      src={src || '/placeholder-product.png'}
      alt={alt}
      className="h-12 w-12 rounded-2xl border border-slate-200 bg-white object-cover"
    />
  );
};

const LoadingState = () => {
  return (
    <div
      className="flex items-center justify-center text-sm text-slate-500"
      style={{ minHeight: '220px' }}
    >
      Đang tải dữ liệu...
    </div>
  );
};

const ErrorState = () => {
  return (
    <div
      className="flex items-center justify-center text-sm text-red-500"
      style={{ minHeight: '220px' }}
    >
      Có lỗi xảy ra khi tải dữ liệu.
    </div>
  );
};

const EmptyState = () => {
  return (
    <div
      className="flex items-center justify-center text-sm text-slate-500"
      style={{ minHeight: '220px' }}
    >
      Chưa có dữ liệu.
    </div>
  );
};
