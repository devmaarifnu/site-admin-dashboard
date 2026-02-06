'use client'

import { useState, useEffect } from 'react'
import { analyticsApi } from '@/lib/api/modules'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, Users, FileText, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null)
  const [contentStats, setContentStats] = useState([])
  const [trafficStats, setTrafficStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const [overviewRes, contentRes, trafficRes] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getContentStats(),
        analyticsApi.getTrafficStats({ period: '30days' }),
      ])
      // Response structure: { success, message, data: {...} }
      const overviewData = overviewRes.data?.data || overviewRes.data || {}
      const contentData = contentRes.data?.data || contentRes.data || []
      const trafficData = trafficRes.data?.data || trafficRes.data || []
      
      setOverview(overviewData)
      setContentStats(Array.isArray(contentData) ? contentData : [])
      setTrafficStats(Array.isArray(trafficData) ? trafficData : [])
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">Analytics</h1>
        <div className="text-center py-12">
          <p className="text-neutral-500">Memuat data analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Analytics</h1>
        <p className="text-neutral-500 mt-1">Lihat statistik dan performa website</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.total_visitors?.toLocaleString() || 0}</div>
            <p className="text-xs text-neutral-500 mt-1">
              <span className="text-green-600">+12%</span> dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.total_page_views?.toLocaleString() || 0}</div>
            <p className="text-xs text-neutral-500 mt-1">
              <span className="text-green-600">+8%</span> dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.total_content || 0}</div>
            <p className="text-xs text-neutral-500 mt-1">
              Berita, Opini, dan Dokumen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Avg. Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.avg_session_duration || '2m 34s'}</div>
            <p className="text-xs text-neutral-500 mt-1">
              Durasi rata-rata kunjungan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Trend (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#059669" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
