import { useState, useCallback } from 'react';

interface UseTableFiltersProps<T> {
  initialFilters?: T;
  onFilterChange?: (filters: T) => void;
}

export function useTableFilters<T extends Record<string, any>>({
  initialFilters = {} as T,
  onFilterChange
}: UseTableFiltersProps<T> = {}) {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = useCallback((key: keyof T, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      onFilterChange?.(updated);
      return updated;
    });
  }, [onFilterChange]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    onFilterChange?.(initialFilters);
  }, [initialFilters, onFilterChange]);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    setFilters
  };
}

// Função utilitária para query params
export function buildQueryParams(params: Record<string, any>): string {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(`${key}[]`, String(item)));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });
  
  return queryParams.toString();
}