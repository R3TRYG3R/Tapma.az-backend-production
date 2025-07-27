// src/features/ad/types/pagination-result.interface.ts

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  nextPage: number | null;
}