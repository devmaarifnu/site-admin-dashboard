'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BoardMemberForm } from '@/components/organization/BoardMemberForm'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function EditBoardMemberPage() {
  const router = useRouter()
  const params = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchMember()
  }, [params.id])

  const fetchMember = async () => {
    try {
      const response = await organizationApi.getBoardMemberById(params.id)
      setMember(response.data || response)
    } catch (error) {
      toast.error('Gagal memuat data board member')
      router.push('/organization/board-members')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await organizationApi.updateBoardMember(params.id, data)
      toast.success('Board member berhasil diupdate')
      router.push('/organization/board-members')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate board member')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-neutral-500">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Edit Board Member</h1>
        <p className="text-neutral-500 mt-1">Update informasi board member</p>
      </div>

      {member && <BoardMemberForm member={member} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
