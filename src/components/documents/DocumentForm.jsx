'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUploader from '@/components/shared/ImageUploader'
import { categoriesTagsApi } from '@/lib/api/categories-tags'
import { toast } from 'sonner'
import { Upload, FileText } from 'lucide-react'

const documentSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(500),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Kategori harus dipilih'),
  is_public: z.boolean(),
  status: z.enum(['draft', 'published']),
})

export function DocumentForm({ document, onSubmit, loading }) {
  const [categories, setCategories] = useState([])
  const [fileUrl, setFileUrl] = useState(document?.file_url || '')
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: document || {
      title: '',
      description: '',
      category_id: '',
      is_public: true,
      status: 'draft',
    },
  })

  const categoryId = watch('category_id')
  const status = watch('status')
  const isPublic = watch('is_public')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoriesTagsApi.getCategories({ type: 'document' })
      setCategories(response.data.data || response.data)
    } catch (error) {
      toast.error('Gagal memuat kategori')
    }
  }

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tag', 'document')
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
      setFileUrl(data.data?.url || data.url)
      toast.success('File berhasil diupload')
    } catch (error) {
      toast.error('Gagal mengupload file')
    } finally {
      setUploading(false)
    }
  }

  const handleFormSubmit = (data) => {
    if (!fileUrl && !document) {
      toast.error('File harus diupload')
      return
    }

    onSubmit({
      ...data,
      file_url: fileUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Dokumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>File Dokumen *</Label>
            <div className="mt-2">
              {fileUrl ? (
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <FileText className="h-8 w-8 text-primary-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">File sudah diupload</p>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Lihat file
                    </a>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFileUrl('')}
                  >
                    Ganti File
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                  <input
                    type="file"
                    id="document-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    disabled={uploading}
                  />
                  <label htmlFor="document-upload">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      onClick={() => document.getElementById('document-upload').click()}
                    >
                      {uploading ? 'Mengupload...' : 'Pilih File'}
                    </Button>
                  </label>
                  <p className="text-sm text-neutral-500 mt-2">
                    PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 50MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Dokumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Dokumen *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Masukkan judul dokumen"
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
              placeholder="Masukkan deskripsi dokumen (opsional)"
              className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category_id">Kategori *</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setValue('category_id', value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-red-600 mt-1">{errors.category_id.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_public"
              checked={isPublic}
              onChange={(e) => setValue('is_public', e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="is_public">Dokumen dapat diakses publik</Label>
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={(value) => setValue('status', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? 'Menyimpan...' : document ? 'Update Dokumen' : 'Upload Dokumen'}
        </Button>
      </div>
    </form>
  )
}
