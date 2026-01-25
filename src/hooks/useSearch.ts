import { useState, useCallback } from 'react';

interface UseSearchProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
}

interface UseSearchResult<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearch: boolean;
  toggleSearch: () => void;
  filteredData: T[];
}

export function useSearch<T>({ data, searchKeys }: UseSearchProps<T>): UseSearchResult<T> {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = useCallback(() => {
    setShowSearch((prev) => {
      if (prev) {
        setSearchQuery('');
      }
      return !prev;
    });
  }, []);

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return searchKeys.some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(query);
      }
      return false;
    });
  });

  return {
    searchQuery,
    setSearchQuery,
    showSearch,
    toggleSearch,
    filteredData,
  };
}
