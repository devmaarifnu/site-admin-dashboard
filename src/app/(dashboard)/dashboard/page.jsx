'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import { Newspaper, FileText, FileBox, Eye } from 'lucide-react';
import { dashboardApi } from '@/lib/api/dashboard';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes, popularRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivity(),
        dashboardApi.getPopularContent(),
      ]);
      setStats(statsRes.data.data);
      setRecentActivity(activityRes.data.data || []);
      setPopularContent(popularRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          Selamat datang di Admin Portal LP Ma&apos;arif NU
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Berita"
          value={stats?.news?.total ?? 0}
          trend={stats?.news?.trend ?? 0}
          icon={Newspaper}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Opini"
          value={stats?.opinions?.total ?? 0}
          trend={stats?.opinions?.trend ?? 0}
          icon={FileText}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Dokumen"
          value={stats?.documents?.total ?? 0}
          trend={stats?.documents?.trend ?? 0}
          icon={FileBox}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard
          title="Views Bulan Ini"
          value={stats?.views?.this_month ?? 0}
          trend={stats?.views?.trend ?? 0}
          icon={Eye}
          color="orange"
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity & Popular Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity activities={recentActivity} isLoading={isLoading} />

        <Card>
          <CardHeader>
            <CardTitle>Konten Populer</CardTitle>
            <CardDescription>Artikel dengan views terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-12 ml-4" />
                  </div>
                ))}
              </div>
            ) : popularContent.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Belum ada konten</p>
            ) : (
              <div className="space-y-4">
                {popularContent.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{item.type === 'news' ? 'Berita' : 'Opini'}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4 shrink-0">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.views.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
