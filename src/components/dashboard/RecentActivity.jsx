'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { FileEdit, Trash2, Eye, PlusCircle } from 'lucide-react';

export default function RecentActivity({ activities = [], isLoading = false }) {
  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return <PlusCircle className="h-4 w-4 text-green-600" />;
      case 'update':
        return <FileEdit className="h-4 w-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'publish':
        return <Eye className="h-4 w-4 text-purple-600" />;
      default:
        return <FileEdit className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'create': return 'Membuat';
      case 'update': return 'Memperbarui';
      case 'delete': return 'Menghapus';
      case 'publish': return 'Mempublikasi';
      default: return action || 'Aktivitas';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'publish': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectLabel = (subjectType) => {
    const map = {
      news: 'Berita',
      opinion: 'Opini',
      document: 'Dokumen',
      hero_slide: 'Hero Slide',
      event_flyer: 'Event',
      media: 'Media',
      user: 'User',
    };
    return map[subjectType] || subjectType || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Aktivitas user dalam sistem</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-4 h-4 bg-gray-200 rounded-full mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">Belum ada aktivitas</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="mt-0.5 shrink-0">{getActionIcon(activity.log_name)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.causer_name}
                    </span>
                    <Badge className={getActionColor(activity.log_name)}>
                      {getActionLabel(activity.log_name)}
                    </Badge>
                    {activity.subject_type && (
                      <span className="text-sm text-gray-600">{getSubjectLabel(activity.subject_type)}</span>
                    )}
                  </div>
                  {activity.description && (
                    <p className="text-sm text-gray-600 mt-0.5 truncate">{activity.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(activity.created_at, 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
