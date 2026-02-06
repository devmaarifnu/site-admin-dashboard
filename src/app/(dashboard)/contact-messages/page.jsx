'use client'

import { useState, useEffect } from 'react'
import { contactMessagesApi } from '@/lib/api/modules'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import Pagination from '@/components/shared/Pagination'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })

  useEffect(() => {
    fetchMessages()
  }, [pagination.page])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await contactMessagesApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
      })
      // Response structure: { success, message, data: { items: [...], pagination: {...} } }
      const responseData = response.data?.data || response.data || {}
      const items = responseData.items || []
      setMessages(items)
      setPagination((prev) => ({ 
        ...prev, 
        total: responseData.pagination?.total_items || 0 
      }))
    } catch (error) {
      toast.error('Gagal memuat pesan kontak')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await contactMessagesApi.updateStatus(id, status)
      toast.success(`Pesan ditandai sebagai ${status === 'read' ? 'dibaca' : 'belum dibaca'}`)
      fetchMessages()
    } catch (error) {
      toast.error('Gagal update status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return
    
    try {
      await contactMessagesApi.bulkDelete([id])
      toast.success('Pesan berhasil dihapus')
      fetchMessages()
    } catch (error) {
      toast.error('Gagal menghapus pesan')
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'read') {
      return <Badge variant="secondary">Dibaca</Badge>
    }
    return <Badge variant="default">Baru</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Contact Messages</h1>
        <p className="text-neutral-500 mt-1">Kelola pesan dari form kontak website</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">Memuat data...</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subjek</TableHead>
                  <TableHead>Pesan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                      Belum ada pesan kontak
                    </TableCell>
                  </TableRow>
                ) : (
                  messages?.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                      <TableCell>
                        {message.created_at && format(new Date(message.created_at), 'dd MMM yyyy', { locale: id })}
                      </TableCell>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-neutral-100 rounded">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => alert(`Nama: ${message.name}\nEmail: ${message.email}\n\n${message.message}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            {message.status === 'unread' ? (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(message.id, 'read')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Tandai Dibaca
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(message.id, 'unread')}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Tandai Belum Dibaca
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(message.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {pagination.total > pagination.limit && (
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.limit)}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            />
          )}
        </>
      )}
    </div>
  )
}
