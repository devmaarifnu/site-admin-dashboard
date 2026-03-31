'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EditorialCouncilForm } from '@/components/organization/EditorialCouncilForm'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function CreateEditorialCouncilPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await organizationApi.createEditorialCouncil(data)
      toast.success('Anggota dewan redaksi berhasil ditambahkan')
      router.push('/organization/editorial-council')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan anggota dewan redaksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Tambah Dewan Redaksi</h1>
        <p className="text-neutral-500 mt-1">Tambahkan anggota dewan redaksi baru</p>
      </div>

      <EditorialCouncilForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
