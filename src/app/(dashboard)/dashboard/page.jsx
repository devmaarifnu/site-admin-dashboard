'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import { Newspaper, FileText, FileBox, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import apiClient from '@/lib/api/client';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    news: { total: 0, trend: 0 },
    opinions: { total: 0, trend: 0 },
    documents: { total: 0, trend: 0 },
    views: { total: 0, trend: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // This would be replaced with actual API calls
      // For now, using mock data
      setStats({
        news: { total: 245, trend: 12 },
        opinions: { total: 89, trend: 5 },
        documents: { total: 156, trend: -3 },
        views: { total: 15420, trend: 23 },
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Selamat datang di Admin Portal LP Ma'arif NU
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Berita"
          value={stats.news.total}
          trend={stats.news.trend}
          icon={Newspaper}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Opini"
          value={stats.opinions.total}
          trend={stats.opinions.trend}
          icon={FileText}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Dokumen"
          value={stats.documents.total}
          trend={stats.documents.trend}
          icon={FileBox}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard
          title="Views Bulan Ini"
          value={stats.views.total}
          trend={stats.views.trend}
          icon={Eye}
          color="orange"
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity />
        
        <Card>
          <CardHeader>
            <CardTitle>Konten Populer</CardTitle>
            <CardDescription>Artikel dengan views terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Program Pendidikan Karakter', views: 1234, type: 'Berita' },
                { title: 'Moderasi Beragama di Pesantren', views: 987, type: 'Opini' },
                { title: 'Panduan Administrasi 2024', views: 756, type: 'Dokumen' },
                { title: 'Kurikulum Merdeka', views: 623, type: 'Berita' },
                { title: 'Digitalisasi Pendidikan', views: 512, type: 'Opini' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {item.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
