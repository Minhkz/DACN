export type MegaCategory = { label: string; href: string };
export type MegaProduct = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  inStock?: boolean;
  reviewsCount?: number;
  rating?: number;
  categoryLabel?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: MegaCategory[];
  mega?: {
    products: MegaProduct[];
  };
};
