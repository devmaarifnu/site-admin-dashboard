'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react'
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

export default function DepartmentsPage() {
  const router = useRouter()
  const [departments, setDepartments] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, department: null })

  useEffect(() => { fetchDepartments() }, [])
  useEffect(() => { applyFilters() }, [departments, filters])

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await organizationApi.getDepartments()
      const data = response.data?.data || response.data || []
      setDepartments(Array.isArray(data) ? data : (data.items || []))
    } catch {
      toast.error('Gagal memuat data departemen')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...departments]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((d) => d.name?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q))
    }
    if (filters.status === 'active') result = result.filter((d) => d.is_active)
    else if (filters.status === 'inactive') result = result.filter((d) => !d.is_active)
    setFiltered(result)
  }

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  const resetFilters = () => setFilters({ search: '', status: '' })

  const handleDelete = async () => {
    if (!deleteDialog.department) return
    try {
      await organizationApi.deleteDepartment(deleteDialog.department.id)
      toast.success('Departemen berhasil dihapus')
      setDeleteDialog({ open: false, department: null })
      fetchDepartments()
    } catch {
      toast.error('Gagal menghapus departemen')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Departemen</h1>
            <p className="mt-2 text-gray-600">Kelola data departemen organisasi</p>
          </div>
          <Button onClick={() => router.push('/organization/departments/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Departemen
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchBar
              onSearch={(v) => handleFilterChange('search', v)}
              placeholder="Cari departemen..."
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
                  <TableHead>Nama Departemen</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      Tidak ada data departemen
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell className="max-w-md text-gray-600">{dept.description || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={dept.is_active ? 'default' : 'secondary'}>
                          {dept.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/organization/departments/${dept.id}/members`)}>
                              <Users className="mr-2 h-4 w-4" />Kelola Anggota
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/organization/departments/${dept.id}/edit`)}>
                              <Pencil className="mr-2 h-4 w-4" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, department: dept })} className="text-red-600">
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
        onOpenChange={(open) => setDeleteDialog({ open, department: null })}
        onConfirm={handleDelete}
        title="Hapus Departemen"
        description={`Apakah Anda yakin ingin menghapus departemen ${deleteDialog.department?.name}?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
