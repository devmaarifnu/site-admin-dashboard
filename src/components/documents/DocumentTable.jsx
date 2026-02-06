'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Pencil, Trash2, Download, Eye, FileText } from 'lucide-react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Pagination from '@/components/shared/Pagination'
import EmptyState from '@/components/shared/EmptyState'
import { toast } from 'sonner'
import { documentsApi } from '@/lib/api/documents'

export function DocumentTable({ 
  documents, 
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onDelete,
  onUpdate 
}) {
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, document: null })
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!deleteDialog.document) return
    
    setLoading(true)
    try {
      await documentsApi.delete(deleteDialog.document.id)
      toast.success('Dokumen berhasil dihapus')
      setDeleteDialog({ open: false, document: null })
      onUpdate?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus dokumen')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (document) => {
    window.open(document.file_url, '_blank')
    toast.success('Dokumen sedang diunduh')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
    }
    const labels = {
      active: 'Active',
      inactive: 'Inactive',
    }
    return <Badge variant={variants[status] || 'outline'}>{labels[status] || status}</Badge>
  }

  const getVisibilityBadge = (isPublic) => {
    return (
      <Badge variant={isPublic ? 'default' : 'secondary'}>
        {isPublic ? 'Public' : 'Private'}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Memuat data...</p>
      </div>
    )
  }

  if (!documents || documents.length === 0) {
    return (
      <EmptyState
        title="Belum ada dokumen"
        description="Mulai upload dokumen pertama Anda"
        actionLabel="Upload Dokumen"
        onAction={() => router.push('/documents/upload')}
      />
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tipe File</TableHead>
              <TableHead>Ukuran</TableHead>
              <TableHead>Visibilitas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium max-w-[300px]">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 line-clamp-1">
                        {document.title}
                      </div>
                      {document.description && (
                        <div className="text-xs text-gray-500 line-clamp-1 mt-1">
                          {document.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{document.category?.name || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="uppercase text-xs">
                    {document.file_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatFileSize(document.file_size)}
                </TableCell>
                <TableCell>{getVisibilityBadge(document.is_public)}</TableCell>
                <TableCell>{getStatusBadge(document.status)}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {document.download_count?.toLocaleString() || 0}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(document.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(document.file_url, '_blank')}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(document)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/documents/${document.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteDialog({ open: true, document })}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, document: null })}
        onConfirm={handleDelete}
        title="Hapus Dokumen"
        description={`Apakah Anda yakin ingin menghapus dokumen "${deleteDialog.document?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="destructive"
        isLoading={loading}
      />
    </>
  )
}
