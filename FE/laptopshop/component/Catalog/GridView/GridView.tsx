"use client";

import CardProduct from "@/component/Product/CardProduct/CardProduct";
import { ProductDetailDto } from "@/types/product/ProductDetailDto";
import { ProductPageDto } from "@/types/product/ProductPageDto";
import { Pagination } from "@mui/material";
import { Spin } from "antd";
import React from "react";

type GridViewProps = {
  products: ProductDetailDto[];
  loading?: boolean;
  pageData: ProductPageDto;
  onPageChange?: (page: number) => void;
};

const GridView = ({
  products,
  loading = false,
  pageData,
  onPageChange,
}: GridViewProps) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <Spin size="large" />
      </div>
    );
  }

  if (!products.length) {
    return <div className="text-center py-10">Không có sản phẩm nào.</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {products.map((product) => (
          <CardProduct key={product.id} product={product} />
        ))}
      </div>

      {pageData.totalPages > 1 && onPageChange && (
        <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8">
          <Pagination
            count={pageData.totalPages}
            page={pageData.page + 1}
            shape="rounded"
            onChange={(_, value) => onPageChange(value - 1)}
          />
        </div>
      )}
    </div>
  );
};

export default GridView;
