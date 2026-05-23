'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Pagination({
  currentPage = 1,
  totalPages = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  totalItems = 0,
}) {
  const safePage = Math.max(1, currentPage || 1);
  const safeTotal = totalItems || 0;
  const safeSize = pageSize || 10;
  const safePages = totalPages || 0;

  const startItem = safeTotal === 0 ? 0 : (safePage - 1) * safeSize + 1;
  const endItem = Math.min(safePage * safeSize, safeTotal);

  const canGoPrevious = safePage > 1;
  const canGoNext = safePage < safePages;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-700">
          Menampilkan{' '}
          <span className="font-medium">{startItem}</span>
          {' '}-{' '}
          <span className="font-medium">{endItem}</span>
          {' '}dari{' '}
          <span className="font-medium">{safeTotal}</span>
          {' '}data
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">Data per halaman:</p>
          <Select
            value={safeSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(safePage - 1)}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: safePages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page, and pages around current
                return (
                  page === 1 ||
                  page === safePages ||
                  (page >= safePage - 1 && page <= safePage + 1)
                );
              })
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                const showEllipsis = index > 0 && page - array[index - 1] > 1;

                return (
                  <div key={page} className="flex items-center">
                    {showEllipsis && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <Button
                      variant={page === safePage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  </div>
                );
              })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(safePage + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
