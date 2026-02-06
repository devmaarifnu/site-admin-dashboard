'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DocumentTable } from '@/components/documents/DocumentTable'
import Pagination from '@/components/shared/Pagination'
import { Plus, Search } from 'lucide-react'
import { documentsApi } from '@/lib/api/documents'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  })

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    fetchDocuments()
  }, [pagination.page, debouncedSearch])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
      }
      const response = await documentsApi.getAll(params)
      // Response structure: { success, message, data: { items: [...], pagination: {...} } }
      const responseData = response.data?.data || response.data || {}
      const items = responseData.items || []
      setDocuments(items)
      setPagination((prev) => ({
        ...prev,
        total: responseData.pagination?.total_items || 0,
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memuat dokumen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Document Management</h1>
          <p className="text-neutral-500 mt-1">Kelola semua dokumen dan file</p>
        </div>
        <Button onClick={() => router.push('/documents/upload')}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Dokumen
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Cari dokumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading && !documents.length ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">Memuat data...</p>
        </div>
      ) : (
        <>
          <DocumentTable documents={documents} onUpdate={fetchDocuments} />
          {pagination.total > pagination.limit && (
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.limit)}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            />
          )}
        </>
      )}
    </div>
  )
}
