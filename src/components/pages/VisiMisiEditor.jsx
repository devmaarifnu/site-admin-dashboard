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

const visiMisiSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi'),
  is_active: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  metadata: z.object({
    visi: z.string().min(1, 'Visi wajib diisi'),
    misi: z.array(z.string()).min(1, 'Minimal 1 misi harus diisi'),
    nilai_nilai: z.array(z.object({
      title: z.string().min(1, 'Title wajib diisi'),
      description: z.string().min(1, 'Deskripsi wajib diisi'),
      icon: z.string().min(1, 'Icon wajib diisi'),
    })).optional(),
  }),
})

export default function VisiMisiEditor({ page, onSave, saving }) {
  const [misiList, setMisiList] = useState(page.metadata?.misi || [''])
  const [nilaiList, setNilaiList] = useState(page.metadata?.nilai_nilai || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(visiMisiSchema),
    defaultValues: {
      title: page.title || '',
      is_active: page.is_active !== false,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      metadata: {
        visi: page.metadata?.visi || '',
        misi: page.metadata?.misi || [''],
        nilai_nilai: page.metadata?.nilai_nilai || [],
      },
    },
  })

  useEffect(() => {
    setValue('metadata.misi', misiList)
  }, [misiList, setValue])

  useEffect(() => {
    setValue('metadata.nilai_nilai', nilaiList)
  }, [nilaiList, setValue])

  const addMisi = () => {
    setMisiList([...misiList, ''])
  }

  const removeMisi = (index) => {
    const newList = misiList.filter((_, i) => i !== index)
    setMisiList(newList)
  }

  const updateMisi = (index, value) => {
    const newList = [...misiList]
    newList[index] = value
    setMisiList(newList)
  }

  const addNilai = () => {
    setNilaiList([...nilaiList, { title: '', description: '', icon: '' }])
  }

  const removeNilai = (index) => {
    const newList = nilaiList.filter((_, i) => i !== index)
    setNilaiList(newList)
  }

  const updateNilai = (index, field, value) => {
    const newList = [...nilaiList]
    newList[index][field] = value
    setNilaiList(newList)
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
          <CardTitle>Visi</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register('metadata.visi')}
            placeholder="Masukkan visi organisasi..."
            className="min-h-[120px]"
          />
          {errors.metadata?.visi && (
            <p className="text-sm text-red-600 mt-1">{errors.metadata.visi.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Misi</CardTitle>
            <Button type="button" onClick={addMisi} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Misi
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {misiList.map((misi, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  value={misi}
                  onChange={(e) => updateMisi(index, e.target.value)}
                  placeholder={`Misi ${index + 1}...`}
                  className="min-h-[80px]"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeMisi(index)}
                disabled={misiList.length === 1}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ))}
          {errors.metadata?.misi && (
            <p className="text-sm text-red-600">{errors.metadata.misi.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Nilai-Nilai (Opsional)</CardTitle>
            <Button type="button" onClick={addNilai} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Nilai
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {nilaiList.map((nilai, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Nilai {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNilai(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={nilai.title}
                  onChange={(e) => updateNilai(index, 'title', e.target.value)}
                  placeholder="Contoh: Integritas"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Icon</Label>
                <Input
                  value={nilai.icon}
                  onChange={(e) => updateNilai(index, 'icon', e.target.value)}
                  placeholder="Contoh: integrity, professionalism"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={nilai.description}
                  onChange={(e) => updateNilai(index, 'description', e.target.value)}
                  placeholder="Deskripsi nilai..."
                  className="mt-2 min-h-[80px]"
                />
              </div>
            </div>
          ))}
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
