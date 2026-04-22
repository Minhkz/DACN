export type ProductFilterRequest = {
  price: {
    min: number | null;
    max: number | null;
  };
  filters: Record<string, number[]>;
  sort: "asc" | "desc" | null;
  page: number;
  size: number;
};
