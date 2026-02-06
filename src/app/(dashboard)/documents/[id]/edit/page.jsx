'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DocumentForm } from '@/components/documents/DocumentForm'
import { documentsApi } from '@/lib/api/documents'
import { toast } from 'sonner'

export default function EditDocumentPage() {
  const router = useRouter()
  const params = useParams()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchDocument()
  }, [params.id])

  const fetchDocument = async () => {
    setLoading(true)
    try {
      const response = await documentsApi.getById(params.id)
      const documentData = response.data?.data || response.data
      setDocument(documentData)
    } catch (error) {
      console.error('Error fetching document:', error)
      toast.error('Gagal memuat dokumen')
      router.push('/documents')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      // Update document file via /admin/documents/:id/file endpoint
      await documentsApi.update(params.id, {
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        file_name: data.file_name,
        file_url: data.file_url,
        file_type: data.file_type,
        file_size: data.file_size,
        mime_type: data.mime_type,
        is_public: data.is_public,
        status: data.status,
      })
      
      toast.success('Dokumen berhasil diperbarui')
      router.push('/documents')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui dokumen')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Memuat dokumen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Dokumen</h1>
        <p className="mt-2 text-gray-600">
          Perbarui informasi dokumen
        </p>
      </div>

      <DocumentForm document={document} onSubmit={handleSubmit} loading={submitting} />
    </div>
  )
}
