'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

export default function BoardMembersPage() {
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
      const response = await organizationApi.getBoardMembers()
      // Response structure: { success, message, data: [...] } or { success, message, data: { items: [...] } }
      const members = response.data?.data || response.data || []
      setMembers(Array.isArray(members) ? members : (members.items || []))
    } catch (error) {
      toast.error('Gagal memuat data board members')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.member) return
    
    try {
      await organizationApi.deleteBoardMember(deleteDialog.member.id)
      toast.success('Board member berhasil dihapus')
      setDeleteDialog({ open: false, member: null })
      fetchMembers()
    } catch (error) {
      toast.error('Gagal menghapus board member')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Board Members</h1>
            <p className="text-neutral-500 mt-1">Kelola anggota dewan pengurus</p>
          </div>
          <Button onClick={() => router.push('/organization/board-members/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Board Member
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">Memuat data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {member.photo_url && (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={member.photo_url}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          {member.title && (
                            <p className="text-sm text-neutral-500">{member.title}</p>
                          )}
                          <p className="text-sm text-primary-600 mt-1">{member.position}</p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {member.period_start} {member.period_end && `- ${member.period_end}`}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/organization/board-members/${member.id}/edit`)}
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
