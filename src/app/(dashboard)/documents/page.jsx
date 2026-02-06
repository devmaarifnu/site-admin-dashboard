'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SearchBar from '@/components/shared/SearchBar'
import { DocumentTable } from '@/components/documents/DocumentTable'
import { PlusCircle, FileText } from 'lucide-react'
import { documentsApi } from '@/lib/api/documents'
import { categoriesApi } from '@/lib/api/categories-tags'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [categories, setCategories] = useState([])
  const [allDocuments, setAllDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    status: '',
    is_public: '',
  })

  useEffect(() => {
    fetchDocuments()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterAndPaginateDocuments()
  }, [allDocuments, filters, pagination.page])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await documentsApi.getAll()
      const documentsData = response.data?.data || response.data || []
      console.log('Documents fetched:', documentsData)
      setAllDocuments(documentsData)
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast.error(error.response?.data?.message || 'Gagal memuat dokumen')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll({ type: 'document' })
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filterAndPaginateDocuments = () => {
    let filtered = allDocuments

    // Filter berdasarkan search
    const searchTerm = String(filters.search || '').trim()
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((doc) =>
        doc.title?.toLowerCase().includes(searchLower) ||
        doc.description?.toLowerCase().includes(searchLower) ||
        doc.category?.name?.toLowerCase().includes(searchLower)
      )
    }

    // Filter berdasarkan kategori
    if (filters.category_id) {
      filtered = filtered.filter((doc) => doc.category_id === parseInt(filters.category_id))
    }

    // Filter berdasarkan status
    if (filters.status) {
      filtered = filtered.filter((doc) => doc.status === filters.status)
    }

    // Filter berdasarkan visibility
    if (filters.is_public) {
      const isPublic = filters.is_public === 'true'
      filtered = filtered.filter((doc) => doc.is_public === isPublic)
    }

    // Update total
    const total = filtered.length
    const totalPages = Math.ceil(total / pagination.limit)
    setPagination((prev) => ({ ...prev, total, totalPages }))

    // Pagination
    const startIndex = (pagination.page - 1) * pagination.limit
    const endIndex = startIndex + pagination.limit
    const paginated = filtered.slice(startIndex, endIndex)

    setDocuments(paginated)
  }

  const handleSearch = (searchValue) => {
    setFilters((prev) => ({ ...prev, search: searchValue }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (limit) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }))
  }

  const handleDelete = async (id) => {
    try {
      await documentsApi.delete(id)
      toast.success('Dokumen berhasil dihapus')
      fetchDocuments()
    } catch (error) {
      toast.error('Gagal menghapus dokumen')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-600" />
            Manajemen Dokumen
          </h1>
          <p className="mt-2 text-gray-600">
            Kelola semua dokumen dan file di sini
          </p>
        </div>
        <Button onClick={() => router.push('/documents/upload')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload Dokumen
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Cari dokumen..."
            defaultValue={filters.search}
          />
          
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.category_id}
            onChange={(e) => handleFilterChange('category_id', e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.is_public}
            onChange={(e) => handleFilterChange('is_public', e.target.value)}
          >
            <option value="">Semua Visibilitas</option>
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setFilters({ search: '', category_id: '', status: '', is_public: '' })
              setPagination((prev) => ({ ...prev, page: 1 }))
            }}
          >
            Reset Filter
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <DocumentTable
          documents={documents}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onDelete={handleDelete}
          onUpdate={fetchDocuments}
        />
      </Card>
    </div>
  )
}
