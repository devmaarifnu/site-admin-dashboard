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

const roleTypeLabels = {
  pemimpin_redaksi: 'Pemimpin Redaksi',
  wakil_pemimpin_redaksi: 'Wakil Pemimpin Redaksi',
  redaktur_pelaksana: 'Redaktur Pelaksana',
  tim_redaksi: 'Tim Redaksi',
}

export default function EditorialTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', role_type: '', status: '' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, member: null })

  useEffect(() => { fetchMembers() }, [])
  useEffect(() => { applyFilters() }, [members, filters])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const response = await organizationApi.getEditorialTeam()
      const data = response.data?.data || response.data || []
      setMembers(Array.isArray(data) ? data : (data.items || []))
    } catch {
      toast.error('Gagal memuat data tim redaksi')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...members]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((m) => m.name?.toLowerCase().includes(q) || m.position?.toLowerCase().includes(q))
    }
    if (filters.role_type) result = result.filter((m) => m.role_type === filters.role_type)
    if (filters.status === 'active') result = result.filter((m) => m.is_active)
    else if (filters.status === 'inactive') result = result.filter((m) => !m.is_active)
    setFiltered(result)
  }

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  const resetFilters = () => setFilters({ search: '', role_type: '', status: '' })

  const handleDelete = async () => {
    if (!deleteDialog.member) return
    try {
      await organizationApi.deleteEditorialTeam(deleteDialog.member.id)
      toast.success('Anggota tim redaksi berhasil dihapus')
      setDeleteDialog({ open: false, member: null })
      fetchMembers()
    } catch {
      toast.error('Gagal menghapus anggota tim redaksi')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tim Redaksi</h1>
            <p className="mt-2 text-gray-600">Kelola data tim redaksi</p>
          </div>
          <Button onClick={() => router.push('/organization/editorial-team/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Anggota
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchBar
              onSearch={(v) => handleFilterChange('search', v)}
              placeholder="Cari nama, jabatan..."
              defaultValue={filters.search}
            />
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.role_type}
              onChange={(e) => handleFilterChange('role_type', e.target.value)}
            >
              <option value="">Semua Tipe Peran</option>
              {Object.entries(roleTypeLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
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
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Tipe Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      Tidak ada data tim redaksi
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-gray-600">{member.position}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{roleTypeLabels[member.role_type] || member.role_type}</Badge>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => router.push(`/organization/editorial-team/${member.id}/edit`)}>
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
        title="Hapus Anggota Tim Redaksi"
        description={`Apakah Anda yakin ingin menghapus ${deleteDialog.member?.name}?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
