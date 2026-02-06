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
import { MoreHorizontal, Pencil, Trash2, Lock, Unlock } from 'lucide-react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { toast } from 'sonner'
import { usersApi } from '@/lib/api/users'

export function UserTable({ users, onUpdate }) {
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null })
  const [statusDialog, setStatusDialog] = useState({ open: false, user: null })
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!deleteDialog.user) return
    
    setLoading(true)
    try {
      await usersApi.delete(deleteDialog.user.id)
      toast.success('User berhasil dihapus')
      setDeleteDialog({ open: false, user: null })
      onUpdate?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus user')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!statusDialog.user) return
    
    setLoading(true)
    try {
      const newStatus = statusDialog.user.status === 'active' ? 'inactive' : 'active'
      await usersApi.update(statusDialog.user.id, { status: newStatus })
      toast.success(`User berhasil di${newStatus === 'active' ? 'aktifkan' : 'nonaktifkan'}`)
      setStatusDialog({ open: false, user: null })
      onUpdate?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengubah status user')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    const variants = {
      super_admin: 'destructive',
      admin: 'default',
      redaktur: 'secondary'
    }
    return <Badge variant={variants[role] || 'outline'}>{role.replace('_', ' ')}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive'
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                  Tidak ada data user
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.last_login ? new Date(user.last_login).toLocaleDateString('id-ID') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/users/${user.id}/edit`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusDialog({ open: true, user })}>
                          {user.status === 'active' ? (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              Nonaktifkan
                            </>
                          ) : (
                            <>
                              <Unlock className="mr-2 h-4 w-4" />
                              Aktifkan
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteDialog({ open: true, user })}
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
        onOpenChange={(open) => setDeleteDialog({ open, user: null })}
        onConfirm={handleDelete}
        title="Hapus User"
        description={`Apakah Anda yakin ingin menghapus user ${deleteDialog.user?.name}? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="destructive"
        loading={loading}
      />

      <ConfirmDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog({ open, user: null })}
        onConfirm={handleToggleStatus}
        title={`${statusDialog.user?.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'} User`}
        description={`Apakah Anda yakin ingin ${statusDialog.user?.status === 'active' ? 'menonaktifkan' : 'mengaktifkan'} user ${statusDialog.user?.name}?`}
        confirmText={statusDialog.user?.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
        loading={loading}
      />
    </>
  )
}
