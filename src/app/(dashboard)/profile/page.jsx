'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import apiClient from '@/lib/api/client'

const profileSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
})

const passwordSchema = z.object({
  current_password: z.string().min(6, 'Password minimal 6 karakter'),
  new_password: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirm_password: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirm_password'],
})

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user, resetProfile])

  const onSubmitProfile = async (data) => {
    setLoading(true)
    try {
      const response = await apiClient.put('/users/profile', data)
      
      // Update user in auth store
      if (response.data?.data) {
        updateUser(response.data.data)
      }
      
      toast.success('Profil berhasil diperbarui')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil')
    } finally {
      setLoading(false)
    }
  }

  const onSubmitPassword = async (data) => {
    setPasswordLoading(true)
    try {
      await apiClient.put('/users/change-password', {
        current_password: data.current_password,
        new_password: data.new_password,
      })
      
      toast.success('Password berhasil diubah')
      resetPassword()
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error.response?.data?.message || 'Gagal mengubah password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Profil Saya</h1>
        <p className="text-neutral-500 mt-1">Kelola informasi profil dan keamanan akun Anda</p>
      </div>

      {/* Profile Information */}
      <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                {...registerProfile('name')}
                placeholder="John Doe"
                className="mt-2"
              />
              {profileErrors.name && (
                <p className="text-sm text-red-600 mt-1">{profileErrors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...registerProfile('email')}
                placeholder="john@example.com"
                className="mt-2"
              />
              {profileErrors.email && (
                <p className="text-sm text-red-600 mt-1">{profileErrors.email.message}</p>
              )}
            </div>

            <div>
              <Label>Role</Label>
              <Input
                value={user?.role || '-'}
                disabled
                className="mt-2 bg-neutral-50"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Change Password */}
      <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
        <Card>
          <CardHeader>
            <CardTitle>Ubah Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current_password">Password Saat Ini *</Label>
              <Input
                id="current_password"
                type="password"
                {...registerPassword('current_password')}
                placeholder="Masukkan password saat ini"
                className="mt-2"
              />
              {passwordErrors.current_password && (
                <p className="text-sm text-red-600 mt-1">
                  {passwordErrors.current_password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="new_password">Password Baru *</Label>
              <Input
                id="new_password"
                type="password"
                {...registerPassword('new_password')}
                placeholder="Masukkan password baru"
                className="mt-2"
              />
              {passwordErrors.new_password && (
                <p className="text-sm text-red-600 mt-1">
                  {passwordErrors.new_password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirm_password">Konfirmasi Password Baru *</Label>
              <Input
                id="confirm_password"
                type="password"
                {...registerPassword('confirm_password')}
                placeholder="Konfirmasi password baru"
                className="mt-2"
              />
              {passwordErrors.confirm_password && (
                <p className="text-sm text-red-600 mt-1">
                  {passwordErrors.confirm_password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Mengubah...' : 'Ubah Password'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
