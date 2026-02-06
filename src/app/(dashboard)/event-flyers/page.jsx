'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { eventFlyersApi } from '@/lib/api/modules'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Pagination from '@/components/shared/Pagination'

export default function EventFlyersPage() {
  const router = useRouter()
  const [flyers, setFlyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, flyer: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8) // 4x2 grid

  // Calculate pagination
  const totalItems = flyers?.length || 0
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedFlyers = flyers?.slice(startIndex, endIndex) || []

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  useEffect(() => {
    fetchFlyers()
  }, [])

  const fetchFlyers = async () => {
    setLoading(true)
    try {
      const response = await eventFlyersApi.getAll()
      console.log('Event flyers API response:', response)
      
      // Response structure: { success, message, data: [...], pagination: {...} }
      const responseData = response.data || response
      const items = Array.isArray(responseData.data) ? responseData.data : []
      
      console.log('Flyers extracted:', items.length, items)
      setFlyers(items)
    } catch (error) {
      console.error('Error fetching event flyers:', error)
      toast.error('Gagal memuat event flyers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.flyer) return
    
    try {
      await eventFlyersApi.delete(deleteDialog.flyer.id)
      toast.success('Event flyer berhasil dihapus')
      setDeleteDialog({ open: false, flyer: null })
      fetchFlyers()
    } catch (error) {
      toast.error('Gagal menghapus event flyer')
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Event Flyers</h1>
            <p className="text-neutral-500 mt-1">Kelola poster dan flyer event</p>
          </div>
          <Button onClick={() => router.push('/event-flyers/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Event Flyer
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">Memuat data...</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="text-center py-12 col-span-full">
            <p className="text-neutral-500">Belum ada event flyer</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedFlyers.map((flyer) => (
              <Card key={flyer.id} className="overflow-hidden">
                <div className="relative aspect-[3/4] bg-neutral-100">
                  <Image
                    src={flyer.image}
                    alt={flyer.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={flyer.is_active ? 'default' : 'secondary'}>
                      {flyer.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2">{flyer.title}</h3>
                      {flyer.event_date && (
                        <p className="text-sm text-neutral-600 mt-1">
                          {new Date(flyer.event_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                      {flyer.event_location && (
                        <p className="text-xs text-neutral-500 mt-1">{flyer.event_location}</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/event-flyers/${flyer.id}/edit`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteDialog({ open: true, flyer })}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
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
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, flyer: null })}
        onConfirm={handleDelete}
        title="Hapus Event Flyer"
        description={`Apakah Anda yakin ingin menghapus flyer "${deleteDialog.flyer?.title}"?`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
