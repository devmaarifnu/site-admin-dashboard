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

const editorialCouncilSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  institution: z.string().min(1, 'Institusi harus diisi'),
  expertise: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  order_number: z.number().int().min(0),
  is_active: z.boolean(),
})

export function EditorialCouncilForm({ member, onSubmit, loading }) {
  const [photoUrl, setPhotoUrl] = useState(member?.photo || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(editorialCouncilSchema),
    defaultValues: member
      ? {
          name: member.name || '',
          institution: member.institution || '',
          expertise: member.expertise || '',
          bio: member.bio || '',
          email: member.email || '',
          order_number: member.order_number ?? 0,
          is_active: member.is_active ?? true,
        }
      : {
          name: '',
          institution: '',
          expertise: '',
          bio: '',
          email: '',
          order_number: 0,
          is_active: true,
        },
  })

  const isActive = watch('is_active')

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
          <ImageUploader
            value={photoUrl}
            onChange={(url) => setPhotoUrl(url)}
            folder="profile"
            label=""
            maxSize={2}
          />
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
            <Label htmlFor="institution">Institusi *</Label>
            <Input id="institution" {...register('institution')} placeholder="e.g. Universitas Indonesia" className="mt-2" />
            {errors.institution && <p className="text-sm text-red-600 mt-1">{errors.institution.message}</p>}
          </div>

          <div>
            <Label htmlFor="expertise">Keahlian</Label>
            <Input id="expertise" {...register('expertise')} placeholder="e.g. Pendidikan Islam, Kurikulum" className="mt-2" />
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
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : member ? 'Update' : 'Tambah Dewan Redaksi'}
        </Button>
      </div>
    </form>
  )
}
