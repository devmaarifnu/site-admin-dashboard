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
import { toast } from 'sonner'
import Image from 'next/image'

const heroSlideSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(200),
  description: z.string().max(200, 'Deskripsi maksimal 200 karakter').optional(),
  primary_cta_label: z.string().optional(),
  primary_cta_link: z.string().optional(),
  secondary_cta_label: z.string().optional(),
  secondary_cta_link: z.string().optional(),
  order_number: z.number().int().min(1),
  active: z.boolean(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export function HeroSlideForm({ slide, onSubmit, loading }) {
  const [imageUrl, setImageUrl] = useState(slide?.image_url || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      title: '',
      description: '',
      primary_cta_label: '',
      primary_cta_link: '',
      secondary_cta_label: '',
      secondary_cta_link: '',
      order_number: 1,
      active: true,
      start_date: '',
      end_date: '',
    },
  })

  const active = watch('active')

  // Update form when slide data is loaded
  useEffect(() => {
    if (slide) {
      // Set image URL
      setImageUrl(slide.image_url || '')

      // Convert ISO datetime to date format (YYYY-MM-DD)
      const startDate = slide.start_date ? slide.start_date.split('T')[0] : ''
      const endDate = slide.end_date ? slide.end_date.split('T')[0] : ''

      // Reset form with slide data
      reset({
        title: slide.title || '',
        description: slide.description || '',
        primary_cta_label: slide.primary_cta_label || '',
        primary_cta_link: slide.primary_cta_link || '',
        secondary_cta_label: slide.secondary_cta_label || '',
        secondary_cta_link: slide.secondary_cta_link || '',
        order_number: slide.order_number || 1,
        active: slide.active ?? true,
        start_date: startDate,
        end_date: endDate,
      })
    }
  }, [slide, reset])

  const handleFormSubmit = (data) => {
    if (!imageUrl && !slide) {
      toast.error('Gambar harus diupload')
      return
    }

    // Convert date to ISO datetime format or remove if empty
    const payload = {
      ...data,
      image: imageUrl,
      order_number: parseInt(data.order_number),
    }

    // Convert start_date to ISO datetime if exists
    if (payload.start_date && payload.start_date !== '') {
      payload.start_date = new Date(payload.start_date + 'T00:00:00').toISOString()
    } else {
      delete payload.start_date
    }

    // Convert end_date to ISO datetime if exists
    if (payload.end_date && payload.end_date !== '') {
      payload.end_date = new Date(payload.end_date + 'T23:59:59').toISOString()
    } else {
      delete payload.end_date
    }

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gambar Hero Slide</CardTitle>
        </CardHeader>
        <CardContent>
          {imageUrl ? (
            <div className="space-y-4">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setImageUrl('')}
              >
                Ganti Gambar
              </Button>
            </div>
          ) : (
            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
              folder="hero"
              label=""
              description="Recommended size: 1920x1080px (Max 5MB)"
              maxSize={5}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Slide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Masukkan judul slide"
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
              placeholder="Masukkan deskripsi (max 200 karakter)"
              className="mt-2 w-full min-h-[80px] px-3 py-2 border rounded-md"
              maxLength={200}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary_cta_label">Primary CTA Label</Label>
              <Input
                id="primary_cta_label"
                {...register('primary_cta_label')}
                placeholder="e.g. Selengkapnya"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="primary_cta_link">Primary CTA Link</Label>
              <Input
                id="primary_cta_link"
                {...register('primary_cta_link')}
                placeholder="/tentang-kami"
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="secondary_cta_label">Secondary CTA Label</Label>
              <Input
                id="secondary_cta_label"
                {...register('secondary_cta_label')}
                placeholder="e.g. Hubungi Kami"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="secondary_cta_link">Secondary CTA Link</Label>
              <Input
                id="secondary_cta_link"
                {...register('secondary_cta_link')}
                placeholder="/kontak"
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                {...register('start_date')}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                {...register('end_date')}
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
            <Label htmlFor="active">Slide aktif (tampilkan di website)</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : slide ? 'Update Slide' : 'Tambah Slide'}
        </Button>
      </div>
    </form>
  )
}
