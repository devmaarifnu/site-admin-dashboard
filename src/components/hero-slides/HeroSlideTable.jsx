'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2, Eye, GripVertical } from 'lucide-react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Pagination from '@/components/shared/Pagination'
import { toast } from 'sonner'
import { heroSlidesApi } from '@/lib/api/modules'
import Image from 'next/image'

export function HeroSlideTable({ slides, onUpdate }) {
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, slide: null })
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(9) // 3x3 grid

  // Calculate pagination
  const totalItems = slides?.length || 0
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedSlides = slides?.slice(startIndex, endIndex) || []

  // Reset to page 1 when slides change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const handleDelete = async () => {
    if (!deleteDialog.slide) return
    
    setLoading(true)
    try {
      await heroSlidesApi.delete(deleteDialog.slide.id)
      toast.success('Hero slide berhasil dihapus')
      setDeleteDialog({ open: false, slide: null })
      onUpdate?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus hero slide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {totalItems === 0 ? (
          <div className="col-span-full text-center py-12 text-neutral-500">
            Belum ada hero slide
          </div>
        ) : (
          paginatedSlides.map((slide) => (
            <Card key={slide.id} className="overflow-hidden">
              <div className="relative aspect-video bg-neutral-100">
                <Image
                  src={slide.image_url}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={slide.active ? 'default' : 'secondary'}>
                    {slide.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2">{slide.title}</h3>
                    {slide.description && (
                      <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                        {slide.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/hero-slides/${slide.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteDialog({ open: true, slide })}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {slide.primary_cta_label && (
                  <div className="text-sm text-neutral-500 mt-2">
                    CTA: {slide.primary_cta_label}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-neutral-500">Order: {slide.order_number}</span>
                  {slide.start_date && slide.end_date && (
                    <span className="text-xs text-neutral-500">
                      {new Date(slide.start_date).toLocaleDateString('id-ID')} - {new Date(slide.end_date).toLocaleDateString('id-ID')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalItems={totalItems}
        />
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, slide: null })}
        onConfirm={handleDelete}
        title="Hapus Hero Slide"
        description={`Apakah Anda yakin ingin menghapus slide "${deleteDialog.slide?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="destructive"
        loading={loading}
      />
    </>
  )
}
