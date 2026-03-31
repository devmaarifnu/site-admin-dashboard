'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, MoreHorizontal, ArrowLeft } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'

const roleLabels = {
  ketua_bidang: 'Ketua Bidang',
  anggota: 'Anggota',
}

const emptyForm = { name: '', role: 'anggota', order_number: 0, is_active: true }

export default function DepartmentMembersPage({ params }) {
  const { id } = params
  const router = useRouter()
  const [department, setDepartment] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState({ open: false, member: null })
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, member: null })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [deptRes, membersRes] = await Promise.all([
        organizationApi.getDepartmentById(id),
        organizationApi.getDepartmentMembers({ department_id: id }),
      ])
      setDepartment(deptRes.data?.data || deptRes.data || null)
      const data = membersRes.data?.data || membersRes.data || []
      setMembers(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setForm({ ...emptyForm, department_id: parseInt(id) })
    setDialog({ open: true, member: null })
  }

  const openEdit = (member) => {
    setForm({
      department_id: member.department_id,
      name: member.name,
      role: member.role,
      order_number: member.order_number,
      is_active: member.is_active,
    })
    setDialog({ open: true, member })
  }

  const handleSave = async () => {
    if (!form.name) return toast.error('Nama harus diisi')
    setSaving(true)
    try {
      if (dialog.member) {
        await organizationApi.updateDepartmentMember(dialog.member.id, form)
        toast.success('Anggota berhasil diupdate')
      } else {
        await organizationApi.createDepartmentMember({ ...form, department_id: parseInt(id) })
        toast.success('Anggota berhasil ditambahkan')
      }
      setDialog({ open: false, member: null })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.member) return
    try {
      await organizationApi.deleteDepartmentMember(deleteDialog.member.id)
      toast.success('Anggota berhasil dihapus')
      setDeleteDialog({ open: false, member: null })
      fetchData()
    } catch {
      toast.error('Gagal menghapus anggota')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/organization/departments')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Anggota Departemen
            </h1>
            <p className="text-neutral-500 mt-1">
              {department ? department.name : 'Memuat...'}
            </p>
          </div>
          <Button onClick={openCreate}>
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
                  <TableHead>Role</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                      Belum ada anggota departemen
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === 'ketua_bidang' ? 'default' : 'secondary'}>
                          {roleLabels[member.role] || member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.order_number}</TableCell>
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
                            <DropdownMenuItem onClick={() => openEdit(member)}>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialog.open} onOpenChange={(open) => setDialog({ open, member: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog.member ? 'Edit Anggota' : 'Tambah Anggota'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nama *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masukkan nama anggota"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Role *</Label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-2 w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="ketua_bidang">Ketua Bidang</option>
                <option value="anggota">Anggota</option>
              </select>
            </div>
            <div>
              <Label>Urutan</Label>
              <Input
                type="number"
                value={form.order_number}
                onChange={(e) => setForm({ ...form, order_number: parseInt(e.target.value) || 0 })}
                min={0}
                className="mt-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="is_active">Status aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog({ open: false, member: null })}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : dialog.member ? 'Update' : 'Tambah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, member: null })}
        onConfirm={handleDelete}
        title="Hapus Anggota"
        description={`Apakah Anda yakin ingin menghapus ${deleteDialog.member?.name}?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
