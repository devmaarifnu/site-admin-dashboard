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

const roleTypeLabels = {
  pemimpin_redaksi: 'Pemimpin Redaksi',
  wakil_pemimpin_redaksi: 'Wakil Pemimpin Redaksi',
  redaktur_pelaksana: 'Redaktur Pelaksana',
  tim_redaksi: 'Tim Redaksi',
}

export default function EditorialTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, member: null })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const response = await organizationApi.getEditorialTeam()
      const data = response.data?.data || response.data || []
      setMembers(Array.isArray(data) ? data : (data.items || []))
    } catch (error) {
      toast.error('Gagal memuat data tim redaksi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.member) return
    try {
      await organizationApi.deleteEditorialTeam(deleteDialog.member.id)
      toast.success('Anggota tim redaksi berhasil dihapus')
      setDeleteDialog({ open: false, member: null })
      fetchMembers()
    } catch (error) {
      toast.error('Gagal menghapus anggota tim redaksi')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Tim Redaksi</h1>
            <p className="text-neutral-500 mt-1">Kelola data tim redaksi</p>
          </div>
          <Button onClick={() => router.push('/organization/editorial-team/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Anggota
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
                  <TableHead>Tipe Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                      Belum ada data tim redaksi
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{roleTypeLabels[member.role_type] || member.role_type}</TableCell>
                      <TableCell>
                        <Badge variant={member.is_active ? 'default' : 'secondary'}>
                          {member.is_active ? 'Aktif' : 'Nonaktif'}
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
                              onClick={() => router.push(`/organization/editorial-team/${member.id}/edit`)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog({ open: true, member })}
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
        onOpenChange={(open) => setDeleteDialog({ open, member: null })}
        onConfirm={handleDelete}
        title="Hapus Anggota Tim Redaksi"
        description={`Apakah Anda yakin ingin menghapus ${deleteDialog.member?.name}?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
