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

const programStrategisSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi'),
  is_active: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  metadata: z.object({
    programs: z.array(z.object({
      title: z.string().min(1, 'Title wajib diisi'),
      description: z.string().min(1, 'Deskripsi wajib diisi'),
      icon: z.string().min(1, 'Icon wajib diisi'),
    })).min(1, 'Minimal 1 program harus diisi'),
  }),
})

export default function ProgramStrategisEditor({ page, onSave, saving }) {
  const [programList, setProgramList] = useState(page.metadata?.programs || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(programStrategisSchema),
    defaultValues: {
      title: page.title || '',
      is_active: page.is_active !== false,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      metadata: {
        programs: page.metadata?.programs || [],
      },
    },
  })

  useEffect(() => {
    setValue('metadata.programs', programList)
  }, [programList, setValue])

  const addProgram = () => {
    setProgramList([...programList, { title: '', description: '', icon: '' }])
  }

  const removeProgram = (index) => {
    const newList = programList.filter((_, i) => i !== index)
    setProgramList(newList)
  }

  const updateProgram = (index, field, value) => {
    const newList = [...programList]
    newList[index][field] = value
    setProgramList(newList)
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
          <div className="flex justify-between items-center">
            <CardTitle>Program Strategis</CardTitle>
            <Button type="button" onClick={addProgram} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Program
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {programList.map((program, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Program {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProgram(index)}
                  disabled={programList.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={program.title}
                  onChange={(e) => updateProgram(index, 'title', e.target.value)}
                  placeholder="Judul program"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Icon</Label>
                <Input
                  value={program.icon}
                  onChange={(e) => updateProgram(index, 'icon', e.target.value)}
                  placeholder="Contoh: teaching, digital, curriculum"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={program.description}
                  onChange={(e) => updateProgram(index, 'description', e.target.value)}
                  placeholder="Deskripsi program..."
                  className="mt-2 min-h-[100px]"
                />
              </div>
            </div>
          ))}
          {errors.metadata?.programs && (
            <p className="text-sm text-red-600">{errors.metadata.programs.message}</p>
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
