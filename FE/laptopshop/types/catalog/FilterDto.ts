export interface FilterDto {
  id: number;
  name: string;
  type: string;
}

type SortOrder = "asc" | "desc" | null;

export type SelectedFilters = Record<string, number[]>;

export type ProductFilterValue = {
  selected: SelectedFilters;
  minPrice?: number;
  maxPrice?: number;
  sortOrder: SortOrder;
};

export type ProductFilterRequest = {
  price: {
    min: number | null;
    max: number | null;
  };
  filters: Record<string, number[]>;
  sort: SortOrder;
  page: number;
  size: number;
};
