'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BoardMemberForm } from '@/components/organization/BoardMemberForm'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function CreateBoardMemberPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await organizationApi.createBoardMember(data)
      toast.success('Board member berhasil ditambahkan')
      router.push('/organization/board-members')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan board member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Tambah Board Member</h1>
        <p className="text-neutral-500 mt-1">Tambahkan anggota dewan pengurus baru</p>
      </div>

      <BoardMemberForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
