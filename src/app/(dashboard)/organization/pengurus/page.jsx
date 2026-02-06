'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { organizationApi } from '@/lib/api/modules'
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
import Image from 'next/image'

export default function PengurusPage() {
  const router = useRouter()
  const [pengurus, setPengurus] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null })

  useEffect(() => {
    fetchPengurus()
  }, [])

  const fetchPengurus = async () => {
    setLoading(true)
    try {
      const response = await organizationApi.getPengurus()
      // Response structure: { success, message, data: [...] } or { success, message, data: { items: [...] } }
      const pengurus = response.data?.data || response.data || []
      setPengurus(Array.isArray(pengurus) ? pengurus : (pengurus.items || []))
    } catch (error) {
      toast.error('Gagal memuat data pengurus')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.item) return
    
    try {
      await organizationApi.deletePengurus(deleteDialog.item.id)
      toast.success('Pengurus berhasil dihapus')
      setDeleteDialog({ open: false, item: null })
      fetchPengurus()
    } catch (error) {
      toast.error('Gagal menghapus pengurus')
    }
  }

  const getCategoryBadge = (kategori) => {
    const labels = {
      pimpinan_utama: 'Pimpinan Utama',
      bidang: 'Bidang',
      sekretariat: 'Sekretariat',
      bendahara: 'Bendahara'
    }
    return <Badge variant="outline">{labels[kategori] || kategori}</Badge>
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Pengurus</h1>
            <p className="text-neutral-500 mt-1">Kelola data pengurus organisasi</p>
          </div>
          <Button onClick={() => router.push('/organization/pengurus/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pengurus
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">Memuat data...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pengurus?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      Belum ada data pengurus
                    </TableCell>
                  </TableRow>
                ) : (
                  pengurus?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.foto_url && (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={item.foto_url}
                                alt={item.nama}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium">{item.nama}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.jabatan}</TableCell>
                      <TableCell>{getCategoryBadge(item.kategori)}</TableCell>
                      <TableCell>
                        {item.periode_mulai} {item.periode_selesai && `- ${item.periode_selesai}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.active ? 'default' : 'secondary'}>
                          {item.active ? 'Active' : 'Inactive'}
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
                              onClick={() => router.push(`/organization/pengurus/${item.id}/edit`)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog({ open: true, item })}
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
        )}
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, item: null })}
        onConfirm={handleDelete}
        title="Hapus Pengurus"
        description={`Apakah Anda yakin ingin menghapus ${deleteDialog.item?.nama}?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
