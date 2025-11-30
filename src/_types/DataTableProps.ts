export interface ApiPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];          // ← genérico
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  width?: string;
  render?: (item: T) => React.ReactNode; // opcional para customizar célula
}


export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
  filters?: React.ReactNode;
  renderActions?: (item: T) => React.ReactNode;
}


export interface Column<T> {
  key: keyof T;                 // 🔥 garante que a coluna é uma chave real do item
  label: string;
  width?: string | number;
  render?: (item: T) => React.ReactNode;
}