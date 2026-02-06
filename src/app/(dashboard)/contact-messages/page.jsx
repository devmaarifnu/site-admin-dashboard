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
import { MoreHorizontal, Eye, CheckCircle, Trash2, Search, Filter } from 'lucide-react'
import Pagination from '@/components/shared/Pagination'
import SearchBar from '@/components/shared/SearchBar'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' })

  useEffect(() => {
    fetchMessages()
  }, [pagination.page, filters])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status,
        priority: filters.priority,
        search: filters.search,
      }
      const response = await contactMessagesApi.getAll(params)
      // API Response: { success, message, data: [...], pagination: {...} }
      // Axios wraps it, so response.data contains the API response
      const items = response.data.data || []
      const paginationData = response.data.pagination || {}
      setMessages(items)
      setPagination((prev) => ({ 
        ...prev, 
        total: paginationData.total_items || 0 
      }))
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Gagal memuat pesan kontak')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await contactMessagesApi.updateStatus(id, status)
      const statusLabels = {
        read: 'dibaca',
        in_progress: 'diproses',
        resolved: 'selesai'
      }
      toast.success(`Pesan ditandai sebagai ${statusLabels[status] || status}`)
      fetchMessages()
    } catch (error) {
      toast.error('Gagal update status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return
    
    try {
      await contactMessagesApi.delete(id)
      toast.success('Pesan berhasil dihapus')
      fetchMessages()
    } catch (error) {
      toast.error('Gagal menghapus pesan')
    }
  }

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleResetFilters = () => {
    setFilters({ status: '', priority: '', search: '' })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      new: { variant: 'default', label: 'Baru' },
      read: { variant: 'secondary', label: 'Dibaca' },
      in_progress: { variant: 'outline', label: 'Diproses' },
      resolved: { variant: 'outline', label: 'Selesai' },
    }
    const statusInfo = statusMap[status] || { variant: 'outline', label: status }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      low: { variant: 'outline', label: 'Rendah', color: 'text-neutral-600' },
      medium: { variant: 'secondary', label: 'Sedang', color: 'text-orange-600' },
      high: { variant: 'destructive', label: 'Tinggi', color: 'text-red-600' },
    }
    const priorityInfo = priorityMap[priority] || { variant: 'outline', label: priority }
    return <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Contact Messages</h1>
        <p className="text-neutral-500 mt-1">Kelola pesan dari form kontak website</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-neutral-500" />
          <span className="font-medium text-sm">Filter & Pencarian</span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <SearchBar
              value={filters.search}
              onChange={handleSearch}
              placeholder="Cari berdasarkan nama, email, atau subjek..."
            />
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Baru</SelectItem>
              <SelectItem value="read">Dibaca</SelectItem>
              <SelectItem value="in_progress">Diproses</SelectItem>
              <SelectItem value="resolved">Selesai</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select
            value={filters.priority}
            onValueChange={(value) => handleFilterChange('priority', value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Prioritas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Prioritas</SelectItem>
              <SelectItem value="low">Rendah</SelectItem>
              <SelectItem value="medium">Sedang</SelectItem>
              <SelectItem value="high">Tinggi</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="w-full md:w-auto"
          >
            Reset
          </Button>
        </div>
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
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email / Phone</TableHead>
                  <TableHead>Subjek</TableHead>
                  <TableHead>Pesan</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-neutral-500">
                      Belum ada pesan kontak
                    </TableCell>
                  </TableRow>
                ) : (
                  messages?.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-mono text-sm">{message.ticket_id}</TableCell>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{message.email}</div>
                          {message.phone && <div className="text-neutral-500">{message.phone}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                      <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                      <TableCell>{getPriorityBadge(message.priority)}</TableCell>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {message.created_at && format(new Date(message.created_at), 'dd MMM yyyy', { locale: id })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-neutral-100 rounded">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => alert(`Ticket: ${message.ticket_id}\nNama: ${message.name}\nEmail: ${message.email}\nPhone: ${message.phone || '-'}\nSubjek: ${message.subject}\n\n${message.message}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            {message.status === 'new' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(message.id, 'read')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Tandai Dibaca
                              </DropdownMenuItem>
                            )}
                            {message.status === 'read' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(message.id, 'in_progress')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Tandai Diproses
                              </DropdownMenuItem>
                            )}
                            {(message.status === 'read' || message.status === 'in_progress') && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(message.id, 'resolved')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Tandai Selesai
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

          {/* Pagination Info and Controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-500">
              Menampilkan {messages.length} dari {pagination.total} pesan
            </div>
            
            {pagination.total > pagination.limit && (
              <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(pagination.total / pagination.limit)}
                onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
