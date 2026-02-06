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

export default function DepartmentsPage() {
  const router = useRouter()
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, department: null })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await organizationApi.getDepartments()
      // Response structure: { success, message, data: [...] } or { success, message, data: { items: [...] } }
      const departments = response.data?.data || response.data || []
      setDepartments(Array.isArray(departments) ? departments : (departments.items || []))
    } catch (error) {
      toast.error('Gagal memuat data departemen')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.department) return
    
    try {
      await organizationApi.deleteDepartment(deleteDialog.department.id)
      toast.success('Departemen berhasil dihapus')
      setDeleteDialog({ open: false, department: null })
      fetchDepartments()
    } catch (error) {
      toast.error('Gagal menghapus departemen')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Departments</h1>
            <p className="text-neutral-500 mt-1">Kelola data departemen</p>
          </div>
          <Button onClick={() => router.push('/organization/departments/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Departemen
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
                  <TableHead>Nama Departemen</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-neutral-500">
                      Belum ada data departemen
                    </TableCell>
                  </TableRow>
                ) : (
                  departments?.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell className="max-w-md">{dept.description || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={dept.active ? 'default' : 'secondary'}>
                          {dept.active ? 'Active' : 'Inactive'}
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
                              onClick={() => router.push(`/organization/departments/${dept.id}/edit`)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog({ open: true, department: dept })}
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
