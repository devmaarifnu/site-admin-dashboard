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

const roleTypeOptions = [
  { value: 'pemimpin_redaksi', label: 'Pemimpin Redaksi' },
  { value: 'wakil_pemimpin_redaksi', label: 'Wakil Pemimpin Redaksi' },
  { value: 'redaktur_pelaksana', label: 'Redaktur Pelaksana' },
  { value: 'tim_redaksi', label: 'Tim Redaksi' },
]

const editorialTeamSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  position: z.string().min(1, 'Jabatan harus diisi'),
  role_type: z.string().min(1, 'Tipe peran harus dipilih'),
  bio: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  order_number: z.number().int().min(0),
  is_active: z.boolean(),
})

export function EditorialTeamForm({ member, onSubmit, loading }) {
  const [photoUrl, setPhotoUrl] = useState(member?.photo || '')
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(editorialTeamSchema),
    defaultValues: member
      ? {
          name: member.name || '',
          position: member.position || '',
          role_type: member.role_type || '',
          bio: member.bio || '',
          email: member.email || '',
          phone: member.phone || '',
          order_number: member.order_number ?? 0,
          is_active: member.is_active ?? true,
        }
      : {
          name: '',
          position: '',
          role_type: '',
          bio: '',
          email: '',
          phone: '',
          order_number: 0,
          is_active: true,
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
        headers: { 'Authorization': `Bearer ${token}` },
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
                <Image src={photoUrl} alt="Preview" fill className="object-cover" />
              </div>
              <div className="text-center">
                <Button type="button" variant="outline" onClick={() => setPhotoUrl('')}>
                  Ganti Foto
                </Button>
              </div>
            </div>
          ) : (
            <ImageUploader onUpload={handlePhotoUpload} accept="image/*" maxSize={2} disabled={uploading} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Anggota</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input id="name" {...register('name')} placeholder="Masukkan nama lengkap" className="mt-2" />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="position">Jabatan *</Label>
            <Input id="position" {...register('position')} placeholder="e.g. Pemimpin Redaksi" className="mt-2" />
            {errors.position && <p className="text-sm text-red-600 mt-1">{errors.position.message}</p>}
          </div>

          <div>
            <Label htmlFor="role_type">Tipe Peran *</Label>
            <select
              id="role_type"
              {...register('role_type')}
              className="mt-2 w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Pilih tipe peran</option>
              {roleTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.role_type && <p className="text-sm text-red-600 mt-1">{errors.role_type.message}</p>}
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              {...register('bio')}
              placeholder="Biografi singkat"
              className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="email@example.com" className="mt-2" />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Telepon</Label>
            <Input id="phone" {...register('phone')} placeholder="+62812345678" className="mt-2" />
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
          {loading ? 'Menyimpan...' : member ? 'Update' : 'Tambah Tim Redaksi'}
        </Button>
      </div>
    </form>
  )
}
