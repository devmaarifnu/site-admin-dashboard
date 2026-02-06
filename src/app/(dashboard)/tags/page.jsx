'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { categoriesTagsApi } from '@/lib/api/categories-tags'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Input } from '@/components/ui/input'
import Pagination from '@/components/shared/Pagination'
import { useDebounce } from '@/hooks/useDebounce'

export default function TagsPage() {
  const router = useRouter()
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, tag: null })
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })

  useEffect(() => {
    fetchTags()
  }, [debouncedSearch, pagination.page])

  const fetchTags = async () => {
    setLoading(true)
    try {
      const response = await categoriesTagsApi.getTags({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
      })
      // Response structure: { success, message, data: [...] } or { success, message, data: { items: [...] } }
      const responseData = response.data?.data || response.data || {}
      const items = Array.isArray(responseData) ? responseData : (responseData.items || [])
      setTags(items)
      setPagination((prev) => ({ 
        ...prev, 
        total: responseData.pagination?.total_items || 0 
      }))
    } catch (error) {
      toast.error('Gagal memuat data tag')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.tag) return
    
    try {
      await categoriesTagsApi.deleteTag(deleteDialog.tag.id)
      toast.success('Tag berhasil dihapus')
      setDeleteDialog({ open: false, tag: null })
      fetchTags()
    } catch (error) {
      toast.error('Gagal menghapus tag')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Tags</h1>
            <p className="text-neutral-500 mt-1">Kelola tag untuk konten</p>
          </div>
          <Button onClick={() => router.push('/tags/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Tag
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Cari tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">Memuat data...</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Tag</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Jumlah Konten</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                        {searchQuery ? 'Tidak ada tag yang ditemukan' : 'Belum ada data tag'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    tags?.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        <TableCell className="text-neutral-500">{tag.slug}</TableCell>
                        <TableCell>{tag.content_count || 0} konten</TableCell>
                        <TableCell>
                          <Badge variant={tag.active ? 'default' : 'secondary'}>
                            {tag.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/tags/${tag.id}/edit`)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteDialog({ open: true, tag })}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

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

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, tag: null })}
        onConfirm={handleDelete}
        title="Hapus Tag"
        description={`Apakah Anda yakin ingin menghapus tag "${deleteDialog.tag?.name}"?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
