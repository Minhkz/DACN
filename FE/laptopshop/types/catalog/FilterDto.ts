export interface FilterDto {
  id: number;
  name: string;
  type: string;
}

export type SelectedFilters = Record<string, number[]>;

export type ProductFilterValue = {
  selected: SelectedFilters;
  minPrice?: number;
  maxPrice?: number;
};
