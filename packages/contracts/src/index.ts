export interface ApiErrorContract {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
}
