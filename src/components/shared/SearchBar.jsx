'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar({ onSearch, placeholder = 'Cari...', defaultValue = '' }) {
  const [searchValue, setSearchValue] = useState(defaultValue);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Debounce search
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearch}
        className="pl-10"
      />
    </div>
  );
}
