'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, trend, icon: Icon, color = 'blue', isLoading }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  const trendColor = trend >= 0 ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </CardTitle>
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('p-2 rounded-lg', colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {trend !== undefined && (
          <div className="flex items-center mt-1">
            <TrendIcon className={cn('h-4 w-4 mr-1', trendColor)} />
            <p className={cn('text-xs font-medium', trendColor)}>
              {Math.abs(trend)}% dari bulan lalu
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
