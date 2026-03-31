'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DepartmentForm } from '@/components/organization/DepartmentForm'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function EditDepartmentPage() {
  const router = useRouter()
  const params = useParams()
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchDepartment()
  }, [params.id])

  const fetchDepartment = async () => {
    try {
      const response = await organizationApi.getDepartmentById(params.id)
      setDepartment(response.data?.data || response.data || response)
    } catch (error) {
      toast.error('Gagal memuat data departemen')
      router.push('/organization/departments')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await organizationApi.updateDepartment(params.id, data)
      toast.success('Departemen berhasil diupdate')
      router.push('/organization/departments')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate departemen')
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
        <h1 className="text-3xl font-bold text-neutral-900">Edit Departemen</h1>
        <p className="text-neutral-500 mt-1">Update informasi departemen</p>
      </div>

      {department && <DepartmentForm department={department} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
