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
import { Plus, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/shared/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="border rounded-lg p-4 min-h-[200px]">Loading editor...</div>
})

const sejarahSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi'),
  is_active: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  metadata: z.object({
    introduction: z.string().optional(),
    timeline: z.array(z.object({
      year: z.string().min(1, 'Tahun wajib diisi'),
      title: z.string().min(1, 'Title wajib diisi'),
      description: z.string().min(1, 'Deskripsi wajib diisi'),
    })).min(1, 'Minimal 1 timeline harus diisi'),
  }),
})

export default function SejarahEditor({ page, onSave, saving }) {
  const [introduction, setIntroduction] = useState(page.metadata?.introduction || '')
  const [timelineList, setTimelineList] = useState(page.metadata?.timeline || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(sejarahSchema),
    defaultValues: {
      title: page.title || '',
      is_active: page.is_active !== false,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      metadata: {
        introduction: page.metadata?.introduction || '',
        timeline: page.metadata?.timeline || [],
      },
    },
  })

  useEffect(() => {
    setValue('metadata.introduction', introduction)
  }, [introduction, setValue])

  useEffect(() => {
    setValue('metadata.timeline', timelineList)
  }, [timelineList, setValue])

  const addTimeline = () => {
    setTimelineList([...timelineList, { year: '', title: '', description: '' }])
  }

  const removeTimeline = (index) => {
    const newList = timelineList.filter((_, i) => i !== index)
    setTimelineList(newList)
  }

  const updateTimeline = (index, field, value) => {
    const newList = [...timelineList]
    newList[index][field] = value
    setTimelineList(newList)
  }

  const onSubmit = async (data) => {
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
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={introduction}
            onChange={setIntroduction}
            placeholder="Masukkan pengantar sejarah..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Timeline</CardTitle>
            <Button type="button" onClick={addTimeline} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Timeline
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {timelineList.map((timeline, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Timeline {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeline(index)}
                  disabled={timelineList.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tahun</Label>
                  <Input
                    value={timeline.year}
                    onChange={(e) => updateTimeline(index, 'year', e.target.value)}
                    placeholder="Contoh: 1926"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={timeline.title}
                    onChange={(e) => updateTimeline(index, 'title', e.target.value)}
                    placeholder="Judul event"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={timeline.description}
                  onChange={(e) => updateTimeline(index, 'description', e.target.value)}
                  placeholder="Deskripsi event..."
                  className="mt-2 min-h-[100px]"
                />
              </div>
            </div>
          ))}
          {errors.metadata?.timeline && (
            <p className="text-sm text-red-600">{errors.metadata.timeline.message}</p>
          )}
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
