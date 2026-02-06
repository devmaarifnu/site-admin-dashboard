'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect, useRef } from 'react'
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
import { categoriesTagsApi } from '@/lib/api/categories-tags'
import { toast } from 'sonner'
import { Upload, FileText } from 'lucide-react'

const documentSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(500),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Kategori harus dipilih'),
  is_public: z.boolean(),
  status: z.enum(['active', 'inactive']),
})

export function DocumentForm({ document, onSubmit, loading }) {
  const [categories, setCategories] = useState([])
  const [fileUrl, setFileUrl] = useState(document?.file_url || '')
  const [fileInfo, setFileInfo] = useState({
    fileName: document?.file_name || '',
    fileSize: document?.file_size || 0,
    mimeType: document?.mime_type || '',
    fileType: document?.file_type || '',
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: document?.title || '',
      description: document?.description || '',
      category_id: document?.category_id?.toString() || '',
      is_public: document?.is_public !== undefined ? document.is_public : true,
      status: document?.status || 'active',
    },
  })

  const categoryId = watch('category_id')
  const status = watch('status')
  const isPublic = watch('is_public')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    // Update fileUrl and fileInfo when document prop changes
    if (document) {
      setFileUrl(document.file_url || '')
      setFileInfo({
        fileName: document.file_name || '',
        fileSize: document.file_size || 0,
        mimeType: document.mime_type || '',
        fileType: document.file_type || '',
      })
    }
  }, [document])

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
    
    // Store file info
    const fileName = file.name
    const fileSize = file.size
    const mimeType = file.type
    const fileType = fileName.split('.').pop()?.toUpperCase() || 'PDF'
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tag', 'documents')
    formData.append('is_public', 'true')

    setUploading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cdn/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Upload failed')
      }

      const data = await response.json()
      const uploadedUrl = data.data?.url || data.url
      
      setFileUrl(uploadedUrl)
      setFileInfo({
        fileName,
        fileSize,
        mimeType,
        fileType,
      })
      toast.success('File berhasil diupload')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Gagal mengupload file')
    } finally {
      setUploading(false)
    }
  }

  const handleFormSubmit = (data) => {
    // Untuk edit, fileUrl sudah ada dari document, untuk create harus upload dulu
    if (!fileUrl && !document) {
      toast.error('File harus diupload')
      return
    }

    // Gunakan fileUrl yang baru jika ada upload baru, atau dari document yang ada
    const finalFileUrl = fileUrl || document?.file_url

    if (!finalFileUrl) {
      toast.error('File harus diupload')
      return
    }

    onSubmit({
      title: data.title,
      description: data.description || '',
      category_id: parseInt(data.category_id),
      file_name: fileInfo.fileName || document?.file_name || 'document.pdf',
      file_url: finalFileUrl,
      file_type: fileInfo.fileType || document?.file_type || 'PDF',
      file_size: fileInfo.fileSize || document?.file_size || 0,
      mime_type: fileInfo.mimeType || document?.mime_type || 'application/pdf',
      is_public: data.is_public,
      status: data.status,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{document ? 'File Dokumen' : 'Upload Dokumen'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>File Dokumen *</Label>
            {/* Hidden file input - always rendered */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={uploading}
            />
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
                    onClick={() => {
                      // Reset file input value
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                      // Trigger file picker
                      fileInputRef.current?.click()
                    }}
                    disabled={uploading}
                  >
                    {uploading ? 'Mengupload...' : 'Ganti File'}
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? 'Mengupload...' : 'Pilih File'}
                  </Button>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
