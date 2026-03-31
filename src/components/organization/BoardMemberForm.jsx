'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUploader from '@/components/shared/ImageUploader'
import { organizationApi } from '@/lib/api/modules'
import { toast } from 'sonner'
import Image from 'next/image'

const boardMemberSchema = z.object({
  position_id: z.number({ invalid_type_error: 'Posisi harus dipilih' }).min(1, 'Posisi harus dipilih'),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  title: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  period_start: z.number({ invalid_type_error: 'Periode mulai harus diisi' }).int().min(2000),
  period_end: z.number({ invalid_type_error: 'Periode selesai harus diisi' }).int().min(2000),
  is_active: z.boolean(),
  order_number: z.number().int().min(0),
})

export function BoardMemberForm({ member, onSubmit, loading }) {
  const [photoUrl, setPhotoUrl] = useState(member?.photo || '')
  const [uploading, setUploading] = useState(false)
  const [positions, setPositions] = useState([])

  useEffect(() => {
    organizationApi.getPositions?.()
      .then((res) => {
        const data = res.data?.data || res.data || []
        setPositions(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(boardMemberSchema),
    defaultValues: member
      ? {
          position_id: member.position_id || 0,
          name: member.name || '',
          title: member.title || '',
          bio: member.bio || '',
          email: member.email || '',
          phone: member.phone || '',
          period_start: member.period_start || new Date().getFullYear(),
          period_end: member.period_end || new Date().getFullYear() + 5,
          is_active: member.is_active ?? true,
          order_number: member.order_number ?? 0,
        }
      : {
          position_id: 0,
          name: '',
          title: '',
          bio: '',
          email: '',
          phone: '',
          period_start: new Date().getFullYear(),
          period_end: new Date().getFullYear() + 5,
          is_active: true,
          order_number: 0,
        },
  })

  const isActive = watch('is_active')

  const handlePhotoUpload = async (files) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tag', 'profile')
    formData.append('is_public', 'true')

    setUploading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/cdn/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setPhotoUrl(data.data?.url || data.url)
      toast.success('Foto berhasil diupload')
    } catch {
      toast.error('Gagal mengupload foto')
    } finally {
      setUploading(false)
    }
  }

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      photo: photoUrl || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Foto Profil</CardTitle>
        </CardHeader>
        <CardContent>
          {photoUrl ? (
            <div className="space-y-4">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border mx-auto">
                <Image
                  src={photoUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPhotoUrl('')}
                >
                  Ganti Foto
                </Button>
              </div>
            </div>
          ) : (
            <ImageUploader
              onUpload={handlePhotoUpload}
              accept="image/*"
              maxSize={2}
              disabled={uploading}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="position_id">Posisi/Jabatan *</Label>
            <select
              id="position_id"
              {...register('position_id', { valueAsNumber: true })}
              className="mt-2 w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value={0}>Pilih posisi</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>{pos.position_name}</option>
              ))}
            </select>
            {errors.position_id && (
              <p className="text-sm text-red-600 mt-1">{errors.position_id.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Masukkan nama lengkap"
              className="mt-2"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Gelar Akademik</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="e.g. Prof. Dr., M.Pd"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              {...register('bio')}
              placeholder="Masukkan biografi singkat"
              className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="email@example.com"
              className="mt-2"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Telepon</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+62812345678"
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Periode & Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="period_start">Tahun Mulai *</Label>
              <Input
                id="period_start"
                type="number"
                {...register('period_start', { valueAsNumber: true })}
                placeholder="2024"
                className="mt-2"
              />
              {errors.period_start && (
                <p className="text-sm text-red-600 mt-1">{errors.period_start.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="period_end">Tahun Selesai *</Label>
              <Input
                id="period_end"
                type="number"
                {...register('period_end', { valueAsNumber: true })}
                placeholder="2029"
                className="mt-2"
              />
              {errors.period_end && (
                <p className="text-sm text-red-600 mt-1">{errors.period_end.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="order_number">Urutan</Label>
            <Input
              id="order_number"
              type="number"
              {...register('order_number', { valueAsNumber: true })}
              min={0}
              className="mt-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setValue('is_active', e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="is_active">Status aktif</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? 'Menyimpan...' : member ? 'Update' : 'Tambah Board Member'}
        </Button>
      </div>
    </form>
  )
}
