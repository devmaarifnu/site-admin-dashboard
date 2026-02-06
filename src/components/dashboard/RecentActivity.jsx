'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { FileEdit, Trash2, Eye } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      action: 'create',
      user: 'Ahmad Dahlan',
      resource: 'Berita',
      title: 'Program Pendidikan Karakter',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: 2,
      action: 'update',
      user: 'Siti Aminah',
      resource: 'Opini',
      title: 'Moderasi Beragama',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: 3,
      action: 'delete',
      user: 'Ahmad Dahlan',
      resource: 'Dokumen',
      title: 'Panduan Lama 2023',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: 4,
      action: 'publish',
      user: 'Budi Santoso',
      resource: 'Berita',
      title: 'Kurikulum Merdeka',
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    },
    {
      id: 5,
      action: 'create',
      user: 'Siti Aminah',
      resource: 'Event',
      title: 'Seminar Nasional 2024',
      timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    },
  ];

  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return <FileEdit className="h-4 w-4 text-green-600" />;
      case 'update':
        return <FileEdit className="h-4 w-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'publish':
        return <Eye className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'create':
        return 'Membuat';
      case 'update':
        return 'Memperbarui';
      case 'delete':
        return 'Menghapus';
      case 'publish':
        return 'Mempublikasi';
      default:
        return action;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'publish':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Aktivitas user dalam 24 jam terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="mt-0.5">{getActionIcon(activity.action)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {activity.user}
                  </span>
                  <Badge className={getActionColor(activity.action)}>
                    {getActionLabel(activity.action)}
                  </Badge>
                  <span className="text-sm text-gray-600">{activity.resource}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(activity.timestamp, 'dd MMM yyyy HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
