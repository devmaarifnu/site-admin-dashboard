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
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchDocument()
  }, [params.id])

  const fetchDocument = async () => {
    try {
      const response = await documentsApi.getById(params.id)
      setDocument(response.data || response)
    } catch (error) {
      toast.error('Gagal memuat data dokumen')
      router.push('/documents')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await documentsApi.update(params.id, data)
      toast.success('Dokumen berhasil diupdate')
      router.push('/documents')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate dokumen')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-neutral-500">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Edit Dokumen</h1>
        <p className="text-neutral-500 mt-1">Update informasi dokumen</p>
      </div>

      {document && <DocumentForm document={document} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
