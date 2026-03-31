'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { EditorialCouncilForm } from '@/components/organization/EditorialCouncilForm'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function EditEditorialCouncilPage() {
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
      const response = await organizationApi.getEditorialCouncilById(params.id)
      setMember(response.data?.data || response.data || response)
    } catch (error) {
      toast.error('Gagal memuat data dewan redaksi')
      router.push('/organization/editorial-council')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await organizationApi.updateEditorialCouncil(params.id, data)
      toast.success('Anggota dewan redaksi berhasil diupdate')
      router.push('/organization/editorial-council')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate anggota dewan redaksi')
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
        <h1 className="text-3xl font-bold text-neutral-900">Edit Dewan Redaksi</h1>
        <p className="text-neutral-500 mt-1">Update informasi anggota dewan redaksi</p>
      </div>

      {member && <EditorialCouncilForm member={member} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
