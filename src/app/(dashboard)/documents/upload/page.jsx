'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DocumentForm } from '@/components/documents/DocumentForm'
import { documentsApi } from '@/lib/api/documents'
import { toast } from 'sonner'

export default function UploadDocumentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await documentsApi.create(data)
      toast.success('Dokumen berhasil diupload')
      router.push('/documents')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupload dokumen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Upload Dokumen Baru</h1>
        <p className="text-neutral-500 mt-1">Upload dokumen atau file baru</p>
      </div>

      <DocumentForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
