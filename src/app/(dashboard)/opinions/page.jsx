'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/shared/SearchBar';
import OpinionTable from '@/components/opinions/OpinionTable';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { opinionsApi } from '@/lib/api/opinions';
import { toast } from 'sonner';

export default function OpinionsPage() {
  const router = useRouter();
  const [opinions, setOpinions] = useState([]);
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
    author_name: '',
  });

  const handleCreateOpinion = () => {
    router.push('/opinions/create');
  };

  useEffect(() => {
    fetchOpinions();
  }, [pagination.page, pagination.limit, filters]);

  const fetchOpinions = async () => {
    setIsLoading(true);
    try {
      const response = await opinionsApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      setOpinions(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.total_pages,
      }));
    } catch (error) {
      toast.error('Gagal memuat data opini');
      console.error(error);
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
      await opinionsApi.delete(id);
      toast.success('Opini berhasil dihapus');
      fetchOpinions();
    } catch (error) {
      toast.error('Gagal menghapus opini');
    }
  };

  const handlePublish = async (id) => {
    try {
      await opinionsApi.publish(id);
      toast.success('Opini berhasil dipublikasi');
      fetchOpinions();
    } catch (error) {
      toast.error('Gagal mempublikasi opini');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary-600" />
            Manajemen Opini
          </h1>
          <p className="mt-2 text-gray-600">
            Kelola artikel opini dan pemikiran tokoh
          </p>
        </div>
        <Button onClick={handleCreateOpinion}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Opini Baru
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Cari opini..."
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

          <input
            type="text"
            placeholder="Cari penulis..."
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.author_name}
            onChange={(e) => handleFilterChange('author_name', e.target.value)}
          />

          <Button
            variant="outline"
            onClick={() => {
              setFilters({ search: '', status: '', author_name: '' });
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            Reset Filter
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <OpinionTable
          opinions={opinions}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onDelete={handleDelete}
          onPublish={handlePublish}
        />
      </Card>
    </div>
  );
}
