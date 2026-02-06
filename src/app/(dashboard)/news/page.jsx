'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/shared/SearchBar';
import NewsTable from '@/components/news/NewsTable';
import { PlusCircle } from 'lucide-react';
import { newsApi } from '@/lib/api/news';
import { toast } from 'sonner';

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category_id: '',
    is_featured: '',
  });

  const handleCreateNews = () => {
    router.push('/news/create');
  };

  useEffect(() => {
    fetchNews();
  }, [pagination.page, pagination.limit, filters]);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await newsApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      console.log('News API Response:', response);
      console.log('News data:', response.data);

      setNews(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.total_pages,
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Gagal memuat data berita');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchValue) => {
    setFilters((prev) => ({ ...prev, search: searchValue }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleDelete = async (id) => {
    try {
      await newsApi.delete(id);
      toast.success('Berita berhasil dihapus');
      fetchNews();
    } catch (error) {
      toast.error('Gagal menghapus berita');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await newsApi.toggleFeatured(id);
      toast.success('Status featured berhasil diubah');
      fetchNews();
    } catch (error) {
      toast.error('Gagal mengubah status featured');
    }
  };

  const handlePublish = async (id) => {
    try {
      await newsApi.publish(id);
      toast.success('Berita berhasil dipublikasi');
      fetchNews();
    } catch (error) {
      toast.error('Gagal mempublikasi berita');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Berita</h1>
          <p className="mt-2 text-gray-600">
            Kelola semua artikel berita di sini
          </p>
        </div>
        <Button onClick={handleCreateNews}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Berita Baru
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Cari berita..."
            defaultValue={filters.search}
          />
          
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.is_featured}
            onChange={(e) => handleFilterChange('is_featured', e.target.value)}
          >
            <option value="">Semua</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setFilters({ search: '', status: '', category_id: '', is_featured: '' });
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            Reset Filter
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <NewsTable
          news={news}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onDelete={handleDelete}
          onToggleFeatured={handleToggleFeatured}
          onPublish={handlePublish}
        />
      </Card>
    </div>
  );
}
