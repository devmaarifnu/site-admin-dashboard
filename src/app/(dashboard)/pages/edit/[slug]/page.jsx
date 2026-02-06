'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { pagesApi } from '@/lib/api/modules'
import { toast } from 'sonner'

// Import template components
import VisiMisiEditor from '@/components/pages/VisiMisiEditor'
import SejarahEditor from '@/components/pages/SejarahEditor'
import ProgramStrategisEditor from '@/components/pages/ProgramStrategisEditor'
import PramukaEditor from '@/components/pages/PramukaEditor'
import DefaultEditor from '@/components/pages/DefaultEditor'

const TEMPLATE_COMPONENTS = {
  'visi-misi': VisiMisiEditor,
  'sejarah': SejarahEditor,
  'program-strategis': ProgramStrategisEditor,
  'pramuka': PramukaEditor,
  'default': DefaultEditor
}

export default function EditPagePage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug

  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchPage()
    }
  }, [slug])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const response = await pagesApi.getBySlug(slug)
      const pageData = response.data?.data || response.data
      setPage(pageData)
    } catch (error) {
      console.error('Error fetching page:', error)
      toast.error('Gagal memuat data page')
      router.push('/pages')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data) => {
    try {
      setSaving(true)
      await pagesApi.update(slug, data)
      toast.success('Page berhasil diperbarui')
      fetchPage() // Refresh data
    } catch (error) {
      console.error('Error updating page:', error)
      toast.error(error.response?.data?.message || 'Gagal menyimpan page')
      throw error
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      </div>
    )
  }

  if (!page) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900">Page tidak ditemukan</h3>
              <p className="text-sm text-neutral-500 mt-2">Halaman yang Anda cari tidak tersedia.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/pages')}
              >
                Kembali ke Daftar Pages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get appropriate editor component
  const EditorComponent = TEMPLATE_COMPONENTS[page.template] || TEMPLATE_COMPONENTS['default']

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/pages')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{page.title}</h1>
          <p className="text-neutral-500 mt-1">Edit halaman: {page.slug}</p>
        </div>
      </div>

      <EditorComponent
        page={page}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  )
}
