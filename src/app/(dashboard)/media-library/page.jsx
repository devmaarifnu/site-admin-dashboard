'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Search, Grid, List, Image as ImageIcon, FileVideo, FileText, Download } from 'lucide-react'
import { mediaApi } from '@/lib/api/media'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import Pagination from '@/components/shared/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
import Image from 'next/image'
import { formatFileSize } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function MediaLibraryPage() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [typeFilter, setTypeFilter] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0 })

  useEffect(() => {
    fetchMedia()
  }, [debouncedSearch, pagination.page, typeFilter])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      }
      
      // Only add search if not empty
      if (debouncedSearch && debouncedSearch.trim() !== '') {
        params.search = debouncedSearch
      }
      
      // Only add type filter if not 'all'
      if (typeFilter !== 'all') {
        params.type = typeFilter
      }
      
      const responseData = await mediaApi.getAll(params)
      const items = Array.isArray(responseData.data) ? responseData.data : []
      const paginationData = responseData.pagination || {}
      
      setMedia(items)
      setPagination((prev) => ({ 
        ...prev, 
        total: paginationData.total_items || 0 
      }))
    } catch (error) {
      console.error('Error fetching media:', error)
      toast.error('Gagal memuat media library')
    } finally {
      setLoading(false)
    }
  }

  const getMediaIcon = (type) => {
    if (type?.startsWith('image/')) return <ImageIcon className="h-8 w-8" />
    if (type?.startsWith('video/')) return <FileVideo className="h-8 w-8" />
    return <FileText className="h-8 w-8" />
  }

  const handleDownload = (url, filename) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Media Library</h1>
          <p className="text-neutral-500 mt-1">Kelola file media (gambar, video, dokumen)</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            placeholder="Cari file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipe file" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="image">Gambar</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="document">Dokumen</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">Memuat data...</p>
        </div>
      ) : media?.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-500">
            {searchQuery ? 'Tidak ada file yang ditemukan' : 'Belum ada file di media library'}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media?.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-square bg-neutral-100 relative flex items-center justify-center">
                    {item.file_type === 'image' || item.mime_type?.startsWith('image/') ? (
                      <Image
                        src={item.file_url}
                        alt={item.file_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-neutral-400">
                        {getMediaIcon(item.mime_type || item.file_type)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDownload(item.file_url, item.file_name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" title={item.file_name}>
                      {item.file_name}
                    </p>
                    <p className="text-xs text-neutral-500">{formatFileSize(item.file_size)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg divide-y">
              {media?.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-neutral-50">
                  <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center flex-shrink-0">
                    {item.file_type === 'image' || item.mime_type?.startsWith('image/') ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.file_url}
                          alt={item.file_name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="text-neutral-400 scale-75">
                        {getMediaIcon(item.mime_type || item.file_type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.file_name}</p>
                    <p className="text-sm text-neutral-500">{formatFileSize(item.file_size)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(item.file_url, item.file_name)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}

          {pagination.total > pagination.limit && (
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.limit)}
              pageSize={pagination.limit}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              onPageSizeChange={(limit) => setPagination((prev) => ({ ...prev, limit, page: 1 }))}
              totalItems={pagination.total}
            />
          )}
        </>
      )}
    </div>
  )
}
