'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import SearchBar from '@/components/shared/SearchBar'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

export default function EditorialCouncilPage() {
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, member: null })

  useEffect(() => { fetchMembers() }, [])
  useEffect(() => { applyFilters() }, [members, filters])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const response = await organizationApi.getEditorialCouncil()
      const data = response.data?.data || response.data || []
      setMembers(Array.isArray(data) ? data : (data.items || []))
    } catch {
      toast.error('Gagal memuat data dewan redaksi')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...members]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (m) => m.name?.toLowerCase().includes(q) || m.institution?.toLowerCase().includes(q) ||
          m.expertise?.toLowerCase().includes(q)
      )
    }
    if (filters.status === 'active') result = result.filter((m) => m.is_active)
    else if (filters.status === 'inactive') result = result.filter((m) => !m.is_active)
    setFiltered(result)
  }

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  const resetFilters = () => setFilters({ search: '', status: '' })

  const handleDelete = async () => {
    if (!deleteDialog.member) return
    try {
      await organizationApi.deleteEditorialCouncil(deleteDialog.member.id)
      toast.success('Anggota dewan redaksi berhasil dihapus')
      setDeleteDialog({ open: false, member: null })
      fetchMembers()
    } catch {
      toast.error('Gagal menghapus anggota dewan redaksi')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dewan Redaksi</h1>
            <p className="mt-2 text-gray-600">Kelola data dewan redaksi</p>
          </div>
          <Button onClick={() => router.push('/organization/editorial-council/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Anggota
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchBar
              onSearch={(v) => handleFilterChange('search', v)}
              placeholder="Cari nama, institusi, keahlian..."
              defaultValue={filters.search}
            />
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
            <div />
            <Button variant="outline" onClick={resetFilters}>
              Reset Filter
            </Button>
          </div>
        </Card>

        <Card>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Institusi</TableHead>
                  <TableHead>Keahlian</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      Tidak ada data dewan redaksi
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-gray-600">{member.institution}</TableCell>
                      <TableCell className="max-w-xs truncate text-gray-600">{member.expertise || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={member.is_active ? 'default' : 'secondary'}>
                          {member.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/organization/editorial-council/${member.id}/edit`)}>
                              <Pencil className="mr-2 h-4 w-4" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, member })} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, member: null })}
        onConfirm={handleDelete}
        title="Hapus Anggota Dewan Redaksi"
        description={`Apakah Anda yakin ingin menghapus ${deleteDialog.member?.name}?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
