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
import Image from 'next/image'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const positionTypeLabels = {
  ketua: 'Ketua', wakil: 'Wakil', sekretaris: 'Sekretaris',
  bendahara: 'Bendahara', bidang: 'Bidang', anggota: 'Anggota',
}

export default function BoardMembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [positions, setPositions] = useState([])
  const [filters, setFilters] = useState({ search: '', position_id: '', status: '' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, member: null })

  useEffect(() => { fetchData() }, [])
  useEffect(() => { applyFilters() }, [members, filters])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [membersRes, positionsRes] = await Promise.all([
        organizationApi.getBoardMembers(),
        organizationApi.getPositions(),
      ])
      const data = membersRes.data?.data || membersRes.data || []
      setMembers(Array.isArray(data) ? data : [])
      const posData = positionsRes.data?.data || positionsRes.data || []
      setPositions(Array.isArray(posData) ? posData : [])
    } catch {
      toast.error('Gagal memuat data board members')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...members]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (m) => m.name?.toLowerCase().includes(q) || m.title?.toLowerCase().includes(q) ||
          m.position?.position_name?.toLowerCase().includes(q)
      )
    }
    if (filters.position_id) result = result.filter((m) => m.position_id === parseInt(filters.position_id))
    if (filters.status === 'active') result = result.filter((m) => m.is_active)
    else if (filters.status === 'inactive') result = result.filter((m) => !m.is_active)
    setFiltered(result)
  }

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  const resetFilters = () => setFilters({ search: '', position_id: '', status: '' })

  const handleDelete = async () => {
    if (!deleteDialog.member) return
    try {
      await organizationApi.deleteBoardMember(deleteDialog.member.id)
      toast.success('Board member berhasil dihapus')
      setDeleteDialog({ open: false, member: null })
      fetchData()
    } catch {
      toast.error('Gagal menghapus board member')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Board Members</h1>
            <p className="mt-2 text-gray-600">Kelola anggota dewan pengurus</p>
          </div>
          <Button onClick={() => router.push('/organization/board-members/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Board Member
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
              value={filters.position_id}
              onChange={(e) => handleFilterChange('position_id', e.target.value)}
            >
              <option value="">Semua Posisi</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>{pos.position_name}</option>
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
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      Tidak ada data board member
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.photo ? (
                          <div className="relative w-9 h-9 rounded-full overflow-hidden">
                            <Image src={member.photo} alt={member.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                            {member.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          {member.title && <p className="text-xs text-gray-500">{member.title}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{member.position?.position_name || '-'}</p>
                          {member.position?.position_type && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {positionTypeLabels[member.position.position_type] || member.position.position_type}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {member.period_start}{member.period_end ? ` – ${member.period_end}` : ''}
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
                            <DropdownMenuItem onClick={() => router.push(`/organization/board-members/${member.id}/edit`)}>
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
        title="Hapus Board Member"
        description={`Apakah Anda yakin ingin menghapus ${deleteDialog.member?.name}?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
