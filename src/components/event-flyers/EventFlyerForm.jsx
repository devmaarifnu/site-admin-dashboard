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

const eventFlyerSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(200),
  description: z.string().optional(),
  event_date: z.string().optional(),
  event_location: z.string().optional(),
  registration_url: z.string().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  order_number: z.number().int().min(1),
  active: z.boolean(),
  start_display_date: z.string().optional(),
  end_display_date: z.string().optional(),
})

export function EventFlyerForm({ flyer, onSubmit, loading }) {
  const [imageUrl, setImageUrl] = useState(flyer?.image_url || '')
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(eventFlyerSchema),
    defaultValues: flyer || {
      title: '',
      description: '',
      event_date: '',
      event_location: '',
      registration_url: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      order_number: 1,
      active: true,
      start_display_date: '',
      end_display_date: '',
    },
  })

  const active = watch('active')

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tag', 'flyer')
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
      setImageUrl(data.data?.url || data.url)
      toast.success('Flyer berhasil diupload')
    } catch (error) {
      toast.error('Gagal mengupload flyer')
    } finally {
      setUploading(false)
    }
  }

  const handleFormSubmit = (data) => {
    if (!imageUrl && !flyer) {
      toast.error('Gambar flyer harus diupload')
      return
    }

    onSubmit({
      ...data,
      image_url: imageUrl,
      order_number: parseInt(data.order_number),
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gambar Flyer/Poster</CardTitle>
        </CardHeader>
        <CardContent>
          {imageUrl ? (
            <div className="space-y-4">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-lg overflow-hidden border">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImageUrl('')}
                >
                  Ganti Gambar
                </Button>
              </div>
            </div>
          ) : (
            <ImageUploader
              onUpload={handleImageUpload}
              accept="image/*"
              maxSize={5}
              disabled={uploading}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Event *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Masukkan judul event"
              className="mt-2"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Masukkan deskripsi event"
              className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_date">Tanggal Event</Label>
              <Input
                id="event_date"
                type="date"
                {...register('event_date')}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="event_location">Lokasi Event</Label>
              <Input
                id="event_location"
                {...register('event_location')}
                placeholder="Lokasi event"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="registration_url">URL Pendaftaran</Label>
            <Input
              id="registration_url"
              {...register('registration_url')}
              placeholder="https://..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Person</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact_person">Nama Contact Person</Label>
            <Input
              id="contact_person"
              {...register('contact_person')}
              placeholder="Nama contact person"
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_phone">Nomor Telepon</Label>
              <Input
                id="contact_phone"
                {...register('contact_phone')}
                placeholder="+62812345678"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                {...register('contact_email')}
                placeholder="email@example.com"
                className="mt-2"
              />
              {errors.contact_email && (
                <p className="text-sm text-red-600 mt-1">{errors.contact_email.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_display_date">Start Display Date</Label>
              <Input
                id="start_display_date"
                type="date"
                {...register('start_display_date')}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="end_display_date">End Display Date</Label>
              <Input
                id="end_display_date"
                type="date"
                {...register('end_display_date')}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setValue('active', e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="active">Aktif (tampilkan di website)</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? 'Menyimpan...' : flyer ? 'Update Flyer' : 'Tambah Flyer'}
        </Button>
      </div>
    </form>
  )
}
