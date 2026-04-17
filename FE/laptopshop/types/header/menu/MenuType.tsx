import { ProductDetailDto } from "@/types/product/ProductDetailDto";

export type SubCategory = {
  label: string;
  href: string;
  slug?: string;
};

export type NavItem = {
  label: string;
  href: string;
  slug?: string;
  children?: SubCategory[];
};
