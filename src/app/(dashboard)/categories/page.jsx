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

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null })
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })

  useEffect(() => {
    fetchCategories()
  }, [debouncedSearch, pagination.page])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await categoriesTagsApi.getCategories({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
      })
      // Response structure: { success, message, data: [...] } or { success, message, data: { items: [...] } }
      const responseData = response.data?.data || response.data || {}
      const items = Array.isArray(responseData) ? responseData : (responseData.items || [])
      setCategories(items)
      setPagination((prev) => ({ 
        ...prev, 
        total: responseData.pagination?.total_items || 0 
      }))
    } catch (error) {
      toast.error('Gagal memuat data kategori')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.category) return
    
    try {
      await categoriesTagsApi.deleteCategory(deleteDialog.category.id)
      toast.success('Kategori berhasil dihapus')
      setDeleteDialog({ open: false, category: null })
      fetchCategories()
    } catch (error) {
      toast.error('Gagal menghapus kategori')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Categories</h1>
            <p className="text-neutral-500 mt-1">Kelola kategori untuk konten</p>
          </div>
          <Button onClick={() => router.push('/categories/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Cari kategori..."
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
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jumlah Konten</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                        {searchQuery ? 'Tidak ada kategori yang ditemukan' : 'Belum ada data kategori'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories?.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-neutral-500">{category.slug}</TableCell>
                        <TableCell className="max-w-xs truncate">{category.description || '-'}</TableCell>
                        <TableCell>{category.content_count || 0} konten</TableCell>
                        <TableCell>
                          <Badge variant={category.active ? 'default' : 'secondary'}>
                            {category.active ? 'Active' : 'Inactive'}
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
                                onClick={() => router.push(`/categories/${category.id}/edit`)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteDialog({ open: true, category })}
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
        onOpenChange={(open) => setDeleteDialog({ open, category: null })}
        onConfirm={handleDelete}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteDialog.category?.name}"?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
