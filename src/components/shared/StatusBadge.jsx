'use client';

import { cn, getStatusColor } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function StatusBadge({ status, className }) {
  return (
    <Badge
      className={cn(
        getStatusColor(status),
        'font-medium',
        className
      )}
    >
      {status === 'draft' && 'Draft'}
      {status === 'published' && 'Published'}
      {status === 'archived' && 'Archived'}
      {status === 'active' && 'Active'}
      {status === 'inactive' && 'Inactive'}
      {status === 'unread' && 'Unread'}
      {status === 'read' && 'Read'}
      {status === 'replied' && 'Replied'}
    </Badge>
  );
}
