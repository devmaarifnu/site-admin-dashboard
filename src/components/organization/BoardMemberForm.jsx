'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUploader from '@/components/shared/ImageUploader'
import { toast } from 'sonner'
import Image from 'next/image'

const boardMemberSchema = z.object({
  position: z.string().min(1, 'Posisi harus diisi'),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  title: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  facebook_url: z.string().optional(),
  twitter_url: z.string().optional(),
  instagram_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  period_start: z.string().min(1, 'Periode mulai harus diisi'),
  period_end: z.string().optional(),
  active: z.boolean(),
  order_number: z.number().int().min(1),
})

export function BoardMemberForm({ member, onSubmit, loading }) {
  const [photoUrl, setPhotoUrl] = useState(member?.photo_url || '')
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(boardMemberSchema),
    defaultValues: member || {
      position: '',
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      facebook_url: '',
      twitter_url: '',
      instagram_url: '',
      linkedin_url: '',
      period_start: '',
      period_end: '',
      active: true,
      order_number: 1,
    },
  })

  const active = watch('active')

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
    } catch (error) {
      toast.error('Gagal mengupload foto')
    } finally {
      setUploading(false)
    }
  }

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      photo_url: photoUrl,
      order_number: parseInt(data.order_number),
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
            <Label htmlFor="position">Posisi/Jabatan *</Label>
            <Input
              id="position"
              {...register('position')}
              placeholder="e.g. Ketua Umum"
              className="mt-2"
            />
            {errors.position && (
              <p className="text-sm text-red-600 mt-1">{errors.position.message}</p>
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
              className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
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
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebook_url">Facebook URL</Label>
            <Input
              id="facebook_url"
              {...register('facebook_url')}
              placeholder="https://facebook.com/username"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="twitter_url">Twitter/X URL</Label>
            <Input
              id="twitter_url"
              {...register('twitter_url')}
              placeholder="https://twitter.com/username"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="instagram_url">Instagram URL</Label>
            <Input
              id="instagram_url"
              {...register('instagram_url')}
              placeholder="https://instagram.com/username"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              {...register('linkedin_url')}
              placeholder="https://linkedin.com/in/username"
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
              <Label htmlFor="period_start">Periode Mulai *</Label>
              <Input
                id="period_start"
                {...register('period_start')}
                placeholder="2024"
                className="mt-2"
              />
              {errors.period_start && (
                <p className="text-sm text-red-600 mt-1">{errors.period_start.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="period_end">Periode Selesai</Label>
              <Input
                id="period_end"
                {...register('period_end')}
                placeholder="2029"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="order_number">Order Number *</Label>
            <Input
              id="order_number"
              type="number"
              {...register('order_number', { valueAsNumber: true })}
              min={1}
              className="mt-2"
            />
            {errors.order_number && (
              <p className="text-sm text-red-600 mt-1">{errors.order_number.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setValue('active', e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="active">Status aktif</Label>
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
