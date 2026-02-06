'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/shared/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="border rounded-lg p-4 min-h-[200px]">Loading editor...</div>
})

const defaultSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi'),
  content: z.string().optional(),
  is_active: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
})

export default function DefaultEditor({ page, onSave, saving }) {
  const [content, setContent] = useState(page.content || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(defaultSchema),
    defaultValues: {
      title: page.title || '',
      content: page.content || '',
      is_active: page.is_active !== false,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
    },
  })

  useEffect(() => {
    setValue('content', content)
  }, [content, setValue])

  const onSubmit = async (data) => {
    // Keep metadata if exists
    if (page.metadata) {
      data.metadata = page.metadata
    }
    await onSave(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              className="mt-2"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="h-4 w-4"
            />
            <Label htmlFor="is_active" className="cursor-pointer">Aktif</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Masukkan konten halaman..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Meta Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              {...register('meta_title')}
              placeholder="Title untuk SEO"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              {...register('meta_description')}
              placeholder="Deskripsi untuk SEO"
              className="mt-2"
              maxLength={160}
            />
            <p className="text-xs text-neutral-500 mt-1">Maksimal 160 karakter</p>
          </div>
          <div>
            <Label htmlFor="meta_keywords">Meta Keywords</Label>
            <Input
              id="meta_keywords"
              {...register('meta_keywords')}
              placeholder="keyword1, keyword2, keyword3"
              className="mt-2"
            />
            <p className="text-xs text-neutral-500 mt-1">Pisahkan dengan koma</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  )
}
