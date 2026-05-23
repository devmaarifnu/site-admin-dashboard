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
import { User, Trash2, Edit, Eye, Plus, LogIn, LogOut, FileText } from 'lucide-react'

const ACTION_CONFIG = {
  'login':              { label: 'Login',    icon: LogIn,    className: 'bg-blue-100 text-blue-800' },
  'logout':             { label: 'Logout',   icon: LogOut,   className: 'bg-gray-100 text-gray-700' },
  'news.create':        { label: 'Buat',     icon: Plus,     className: 'bg-green-100 text-green-800' },
  'news.update':        { label: 'Edit',     icon: Edit,     className: 'bg-yellow-100 text-yellow-800' },
  'news.delete':        { label: 'Hapus',    icon: Trash2,   className: 'bg-red-100 text-red-800' },
  'news.publish':       { label: 'Publish',  icon: Eye,      className: 'bg-emerald-100 text-emerald-800' },
  'news.archive':       { label: 'Arsip',    icon: FileText, className: 'bg-gray-100 text-gray-700' },
  'opinion.create':     { label: 'Buat',     icon: Plus,     className: 'bg-green-100 text-green-800' },
  'opinion.update':     { label: 'Edit',     icon: Edit,     className: 'bg-yellow-100 text-yellow-800' },
  'opinion.delete':     { label: 'Hapus',    icon: Trash2,   className: 'bg-red-100 text-red-800' },
  'opinion.publish':    { label: 'Publish',  icon: Eye,      className: 'bg-emerald-100 text-emerald-800' },
  'document.create':    { label: 'Buat',     icon: Plus,     className: 'bg-green-100 text-green-800' },
  'document.update':    { label: 'Edit',     icon: Edit,     className: 'bg-yellow-100 text-yellow-800' },
  'document.delete':    { label: 'Hapus',    icon: Trash2,   className: 'bg-red-100 text-red-800' },
  'user.create':        { label: 'Buat',     icon: Plus,     className: 'bg-green-100 text-green-800' },
  'user.update':        { label: 'Edit',     icon: Edit,     className: 'bg-yellow-100 text-yellow-800' },
  'user.delete':        { label: 'Hapus',    icon: Trash2,   className: 'bg-red-100 text-red-800' },
  'user.update_status': { label: 'Status',   icon: Edit,     className: 'bg-purple-100 text-purple-800' },
}

const SUBJECT_LABELS = {
  'news_article':    'Berita',
  'opinion_article': 'Opini',
  'document':        'Dokumen',
  'user':            'User',
}

function ActionBadge({ logName }) {
  if (!logName) return <Badge variant="outline">-</Badge>
  const cfg = ACTION_CONFIG[logName]
  if (!cfg) return <Badge variant="outline" className="font-mono text-xs">{logName}</Badge>
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  )
}

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
      const items = response.data.data || []
      const paginationData = response.data.pagination || {}
      setLogs(items)
      setPagination((prev) => ({
        ...prev,
        total: paginationData.total_items || 0,
      }))
    } catch (error) {
      console.error('Error fetching logs:', error)
      toast.error('Gagal memuat activity logs')
    } finally {
      setLoading(false)
    }
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
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Aksi</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jenis Konten</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-neutral-500">
                      Belum ada activity logs
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, index) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-neutral-400 text-sm">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <ActionBadge logName={log.log_name} />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm text-neutral-700" title={log.description || ''}>
                          {log.description || '-'}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {log.subject_type ? (
                          <span className="text-sm text-neutral-600">
                            {SUBJECT_LABELS[log.subject_type] || log.subject_type}
                            {log.subject_id ? (
                              <span className="text-neutral-400 ml-1 font-mono text-xs">#{log.subject_id}</span>
                            ) : null}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                            <User className="h-3.5 w-3.5 text-neutral-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-700">
                              {log.causer_name || <span className="text-neutral-400 italic">Sistem</span>}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-500 font-mono text-xs whitespace-nowrap">
                        {log.ip_address || '-'}
                      </TableCell>
                      <TableCell className="text-neutral-500 whitespace-nowrap text-sm">
                        {log.created_at && format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-500">
              Menampilkan {logs.length} dari {pagination.total} aktivitas
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
