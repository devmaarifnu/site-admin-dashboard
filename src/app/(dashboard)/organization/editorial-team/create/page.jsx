'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EditorialTeamForm } from '@/components/organization/EditorialTeamForm'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function CreateEditorialTeamPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await organizationApi.createEditorialTeam(data)
      toast.success('Anggota tim redaksi berhasil ditambahkan')
      router.push('/organization/editorial-team')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan anggota tim redaksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Tambah Tim Redaksi</h1>
        <p className="text-neutral-500 mt-1">Tambahkan anggota tim redaksi baru</p>
      </div>

      <EditorialTeamForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
