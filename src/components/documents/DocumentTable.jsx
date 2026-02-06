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
import { toast } from 'sonner'
import { documentsApi } from '@/lib/api/documents'

export function DocumentTable({ documents, onUpdate }) {
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
      published: 'default',
      draft: 'secondary',
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  const getVisibilityBadge = (isPublic) => {
    return (
      <Badge variant={isPublic ? 'default' : 'secondary'}>
        {isPublic ? 'Public' : 'Private'}
      </Badge>
    )
  }

  return (
    <>
      <div className="rounded-md border">
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
            {documents?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-neutral-500">
                  Tidak ada dokumen
                </TableCell>
              </TableRow>
            ) : (
              documents?.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-neutral-500" />
                      {document.title}
                    </div>
                  </TableCell>
                  <TableCell>{document.category?.name || '-'}</TableCell>
                  <TableCell className="uppercase">{document.file_type}</TableCell>
                  <TableCell>{formatFileSize(document.file_size)}</TableCell>
                  <TableCell>{getVisibilityBadge(document.is_public)}</TableCell>
                  <TableCell>{getStatusBadge(document.status)}</TableCell>
                  <TableCell>{document.download_count || 0}</TableCell>
                  <TableCell>
                    {new Date(document.created_at).toLocaleDateString('id-ID')}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, document: null })}
        onConfirm={handleDelete}
        title="Hapus Dokumen"
        description={`Apakah Anda yakin ingin menghapus dokumen "${deleteDialog.document?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="destructive"
        loading={loading}
      />
    </>
  )
}
