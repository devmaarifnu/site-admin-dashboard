'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserForm } from '@/components/users/UserForm'
import { usersApi } from '@/lib/api/users'
import { toast } from 'sonner'

export default function CreateUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await usersApi.create(data)
      toast.success('User berhasil ditambahkan')
      router.push('/users')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Tambah User Baru</h1>
        <p className="text-neutral-500 mt-1">Buat akun user baru untuk admin portal</p>
      </div>

      <UserForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
