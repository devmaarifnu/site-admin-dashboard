'use client'

import { useState, useEffect } from 'react'
import { activityLogsApi } from '@/lib/api/modules'
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
import Pagination from '@/components/shared/Pagination'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { User, FileText, Trash2, Edit, Eye, Plus } from 'lucide-react'

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    fetchLogs()
  }, [pagination.page])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await activityLogsApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
      })
      // Response structure: { success, message, data: { items: [...], pagination: {...} } }
      const responseData = response.data?.data || response.data || {}
      const items = responseData.items || []
      setLogs(items)
      setPagination((prev) => ({ 
        ...prev, 
        total: responseData.pagination?.total_items || 0 
      }))
    } catch (error) {
      toast.error('Gagal memuat activity logs')
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4" />
      case 'update':
        return <Edit className="h-4 w-4" />
      case 'delete':
        return <Trash2 className="h-4 w-4" />
      case 'view':
        return <Eye className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionBadge = (action) => {
    const variants = {
      create: 'default',
      update: 'secondary',
      delete: 'destructive',
      view: 'outline',
    }
    return (
      <Badge variant={variants[action] || 'outline'} className="flex items-center gap-1 w-fit">
        {getActionIcon(action)}
        {action}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Activity Logs</h1>
        <p className="text-neutral-500 mt-1">Riwayat aktivitas user di sistem</p>
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
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      Belum ada activity logs
                    </TableCell>
                  </TableRow>
                ) : (
                  logs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-neutral-400" />
                          <span className="font-medium">{log.user_name || 'System'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.module}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">{log.description}</TableCell>
                      <TableCell className="text-neutral-500 font-mono text-xs">
                        {log.ip_address}
                      </TableCell>
                      <TableCell className="text-neutral-500">
                        {log.created_at && format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
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
