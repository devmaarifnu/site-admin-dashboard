'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { UserForm } from '@/components/users/UserForm'
import { usersApi } from '@/lib/api/users'
import { toast } from 'sonner'

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      const response = await usersApi.getById(params.id)
      setUser(response.data)
    } catch (error) {
      toast.error('Gagal memuat data user')
      router.push('/users')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      // Remove password if empty
      if (!data.password) {
        delete data.password
      }
      await usersApi.update(params.id, data)
      toast.success('User berhasil diupdate')
      router.push('/users')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate user')
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
        <h1 className="text-3xl font-bold text-neutral-900">Edit User</h1>
        <p className="text-neutral-500 mt-1">Update informasi user</p>
      </div>

      {user && <UserForm user={user} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
