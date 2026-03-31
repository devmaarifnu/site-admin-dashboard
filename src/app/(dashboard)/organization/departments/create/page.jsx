'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DepartmentForm } from '@/components/organization/DepartmentForm'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function CreateDepartmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await organizationApi.createDepartment(data)
      toast.success('Departemen berhasil ditambahkan')
      router.push('/organization/departments')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan departemen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Tambah Departemen</h1>
        <p className="text-neutral-500 mt-1">Tambahkan departemen baru</p>
      </div>

      <DepartmentForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
