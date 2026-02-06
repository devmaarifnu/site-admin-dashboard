'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText, Edit, Loader2 } from 'lucide-react'
import { pagesApi } from '@/lib/api/modules'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const TEMPLATE_LABELS = {
  'visi-misi': 'Visi & Misi',
  'sejarah': 'Sejarah',
  'program-strategis': 'Program Strategis',
  'pramuka': 'Pramuka Ma\'arif',
  'default': 'Default'
}

const TEMPLATE_COLORS = {
  'visi-misi': 'bg-blue-100 text-blue-800',
  'sejarah': 'bg-green-100 text-green-800',
  'program-strategis': 'bg-purple-100 text-purple-800',
  'pramuka': 'bg-red-100 text-red-800',
  'default': 'bg-gray-100 text-gray-800'
}

export default function PagesPage() {
  const router = useRouter()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const response = await pagesApi.getAll()
      setPages(response.data?.data || [])
    } catch (error) {
      console.error('Error fetching pages:', error)
      toast.error('Gagal memuat data pages')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: id })
    } catch (error) {
      return dateString
    }
  }

  const getTemplateLabel = (template) => {
    return TEMPLATE_LABELS[template] || TEMPLATE_LABELS['default']
  }

  const getTemplateColor = (template) => {
    return TEMPLATE_COLORS[template] || TEMPLATE_COLORS['default']
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Pages Management</h1>
          <p className="text-neutral-500 mt-1">Kelola halaman statis website</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pages</CardTitle>
          <CardDescription>
            Kelola konten halaman statis website Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-sm font-semibold text-neutral-900">Tidak ada data</h3>
              <p className="mt-1 text-sm text-neutral-500">Belum ada halaman yang tersedia.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                          {page.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTemplateColor(page.template)}>
                          {getTemplateLabel(page.template)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {page.is_active ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {formatDate(page.updated_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/pages/edit/${page.slug}`)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
