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
      // API Response: { success, message, data: [...], pagination: {...} }
      // Axios wraps it, so response.data contains the API response
      const items = response.data.data || []
      const paginationData = response.data.pagination || {}
      setLogs(items)
      setPagination((prev) => ({ 
        ...prev, 
        total: paginationData.total_items || 0 
      }))
    } catch (error) {
      console.error('Error fetching logs:', error)
      toast.error('Gagal memuat activity logs')
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (logName) => {
    if (!logName) return <FileText className="h-4 w-4" />
    
    const name = logName.toLowerCase()
    if (name.includes('create') || name.includes('add')) {
      return <Plus className="h-4 w-4" />
    } else if (name.includes('update') || name.includes('edit')) {
      return <Edit className="h-4 w-4" />
    } else if (name.includes('delete') || name.includes('remove')) {
      return <Trash2 className="h-4 w-4" />
    } else if (name.includes('view') || name.includes('read')) {
      return <Eye className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const getActionBadge = (logName) => {
    if (!logName) return <Badge variant="outline">-</Badge>
    
    const name = logName.toLowerCase()
    let variant = 'outline'
    
    if (name.includes('create') || name.includes('add')) {
      variant = 'default'
    } else if (name.includes('update') || name.includes('edit')) {
      variant = 'secondary'
    } else if (name.includes('delete') || name.includes('remove')) {
      variant = 'destructive'
    } else if (name.includes('view') || name.includes('read')) {
      variant = 'outline'
    }
    
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        {getActionIcon(logName)}
        {logName}
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
                  <TableHead>ID</TableHead>
                  <TableHead>Log Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Subject Type</TableHead>
                  <TableHead>Subject ID</TableHead>
                  <TableHead>Causer Type</TableHead>
                  <TableHead>Causer ID</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>User Agent</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-neutral-500">
                      Belum ada activity logs
                    </TableCell>
                  </TableRow>
                ) : (
                  logs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.id}</TableCell>
                      <TableCell className="whitespace-nowrap">{getActionBadge(log.log_name)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.description || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {log.subject_type ? (
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.subject_type}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.subject_id || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {log.causer_type ? (
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.causer_type}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {log.causer_id ? (
                            <>
                              <User className="h-4 w-4 text-neutral-400" />
                              <span className="font-mono text-sm">{log.causer_id}</span>
                            </>
                          ) : (
                            <span className="text-neutral-400">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {log.properties ? (
                          <pre className="text-xs bg-neutral-50 p-2 rounded overflow-auto max-h-20">
                            {JSON.stringify(log.properties, null, 2)}
                          </pre>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-neutral-500 font-mono text-xs whitespace-nowrap">
                        {log.ip_address || '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-xs text-neutral-500" title={log.user_agent || ''}>
                        {log.user_agent || '-'}
                      </TableCell>
                      <TableCell className="text-neutral-500 whitespace-nowrap">
                        {log.created_at && format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
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
              Menampilkan {logs.length} dari {pagination.total} activity logs
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
