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

const pramukaSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi'),
  is_active: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  metadata: z.object({
    content: z.object({
      hero: z.object({
        title: z.string().min(1, 'Hero title wajib diisi'),
        description: z.string().min(1, 'Hero description wajib diisi'),
      }),
      about: z.object({
        title: z.string().min(1, 'About title wajib diisi'),
        image: z.string().optional().or(z.literal('')),
        paragraphs: z.array(z.string()).min(1, 'Minimal 1 paragraf'),
      }),
      programs: z.object({
        title: z.string().min(1, 'Programs title wajib diisi'),
        description: z.string().optional(),
        list: z.array(z.object({
          title: z.string().min(1, 'Title wajib diisi'),
          description: z.string().min(1, 'Deskripsi wajib diisi'),
          icon: z.string().min(1, 'Icon wajib diisi'),
        })),
      }),
      achievements: z.object({
        title: z.string().min(1, 'Achievements title wajib diisi'),
        description: z.string().optional(),
        list: z.array(z.object({
          title: z.string().min(1, 'Title wajib diisi'),
          description: z.string().min(1, 'Deskripsi wajib diisi'),
          date: z.string().min(1, 'Tanggal wajib diisi'),
          image: z.string().optional().or(z.literal('')),
        })),
      }),
      cta: z.object({
        title: z.string().min(1, 'CTA title wajib diisi'),
        description: z.string().optional(),
      }),
    }),
  }),
})

export default function PramukaEditor({ page, onSave, saving }) {
  const metadata = page.metadata?.content || {
    hero: { title: '', description: '' },
    about: { title: '', image: '', paragraphs: [''] },
    programs: { title: '', description: '', list: [] },
    achievements: { title: '', description: '', list: [] },
    cta: { title: '', description: '' }
  }

  const [paragraphs, setParagraphs] = useState(metadata.about?.paragraphs || [''])
  const [programs, setPrograms] = useState(metadata.programs?.list || [])
  const [achievements, setAchievements] = useState(metadata.achievements?.list || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(pramukaSchema),
    defaultValues: {
      title: page.title || '',
      is_active: page.is_active !== false,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      metadata: {
        content: metadata,
      },
    },
  })

  useEffect(() => {
    setValue('metadata.content.about.paragraphs', paragraphs)
  }, [paragraphs, setValue])

  useEffect(() => {
    setValue('metadata.content.programs.list', programs)
  }, [programs, setValue])

  useEffect(() => {
    setValue('metadata.content.achievements.list', achievements)
  }, [achievements, setValue])

  // Paragraph handlers
  const addParagraph = () => setParagraphs([...paragraphs, ''])
  const removeParagraph = (index) => setParagraphs(paragraphs.filter((_, i) => i !== index))
  const updateParagraph = (index, value) => {
    const newList = [...paragraphs]
    newList[index] = value
    setParagraphs(newList)
  }

  // Program handlers
  const addProgram = () => setPrograms([...programs, { title: '', description: '', icon: '' }])
  const removeProgram = (index) => setPrograms(programs.filter((_, i) => i !== index))
  const updateProgram = (index, field, value) => {
    const newList = [...programs]
    newList[index][field] = value
    setPrograms(newList)
  }

  // Achievement handlers
  const addAchievement = () => setAchievements([...achievements, { title: '', description: '', date: '', image: '' }])
  const removeAchievement = (index) => setAchievements(achievements.filter((_, i) => i !== index))
  const updateAchievement = (index, field, value) => {
    const newList = [...achievements]
    newList[index][field] = value
    setAchievements(newList)
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
            <Input id="title" {...register('title')} className="mt-2" />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="is_active" {...register('is_active')} className="h-4 w-4" />
            <Label htmlFor="is_active" className="cursor-pointer">Aktif</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...register('metadata.content.hero.title')} placeholder="Hero title" className="mt-2" />
            {errors.metadata?.content?.hero?.title && (
              <p className="text-sm text-red-600 mt-1">{errors.metadata.content.hero.title.message}</p>
            )}
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register('metadata.content.hero.description')} placeholder="Hero description" className="mt-2" />
            {errors.metadata?.content?.hero?.description && (
              <p className="text-sm text-red-600 mt-1">{errors.metadata.content.hero.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...register('metadata.content.about.title')} placeholder="About title" className="mt-2" />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input {...register('metadata.content.about.image')} placeholder="https://..." className="mt-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label>Paragraphs</Label>
              <Button type="button" onClick={addParagraph} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Tambah Paragraf
              </Button>
            </div>
            {paragraphs.map((para, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Textarea
                  value={para}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  placeholder={`Paragraf ${index + 1}`}
                  className="min-h-[80px]"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeParagraph(index)} disabled={paragraphs.length === 1}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Programs Section</CardTitle>
            <Button type="button" onClick={addProgram} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Program
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...register('metadata.content.programs.title')} placeholder="Programs title" className="mt-2" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register('metadata.content.programs.description')} placeholder="Programs description" className="mt-2" />
          </div>
          <div className="space-y-4">
            {programs.map((program, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Program {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeProgram(index)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
                <Input value={program.title} onChange={(e) => updateProgram(index, 'title', e.target.value)} placeholder="Title" />
                <Input value={program.icon} onChange={(e) => updateProgram(index, 'icon', e.target.value)} placeholder="Icon" />
                <Textarea value={program.description} onChange={(e) => updateProgram(index, 'description', e.target.value)} placeholder="Description" className="min-h-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Achievements Section</CardTitle>
            <Button type="button" onClick={addAchievement} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Achievement
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...register('metadata.content.achievements.title')} placeholder="Achievements title" className="mt-2" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register('metadata.content.achievements.description')} placeholder="Achievements description" className="mt-2" />
          </div>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Achievement {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeAchievement(index)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
                <Input value={achievement.title} onChange={(e) => updateAchievement(index, 'title', e.target.value)} placeholder="Title" />
                <Input value={achievement.date} onChange={(e) => updateAchievement(index, 'date', e.target.value)} placeholder="Date (YYYY-MM-DD)" type="date" />
                <Input value={achievement.image} onChange={(e) => updateAchievement(index, 'image', e.target.value)} placeholder="Image URL" />
                <Textarea value={achievement.description} onChange={(e) => updateAchievement(index, 'description', e.target.value)} placeholder="Description" className="min-h-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CTA Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...register('metadata.content.cta.title')} placeholder="CTA title" className="mt-2" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register('metadata.content.cta.description')} placeholder="CTA description" className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Meta Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input id="meta_title" {...register('meta_title')} placeholder="Title untuk SEO" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea id="meta_description" {...register('meta_description')} placeholder="Deskripsi untuk SEO" className="mt-2" maxLength={160} />
            <p className="text-xs text-neutral-500 mt-1">Maksimal 160 karakter</p>
          </div>
          <div>
            <Label htmlFor="meta_keywords">Meta Keywords</Label>
            <Input id="meta_keywords" {...register('meta_keywords')} placeholder="keyword1, keyword2, keyword3" className="mt-2" />
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
