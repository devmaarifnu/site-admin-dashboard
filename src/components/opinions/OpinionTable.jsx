'use client';

import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/shared/StatusBadge';
import Pagination from '@/components/shared/Pagination';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function OpinionTable({
  opinions,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onDelete,
  onPublish,
}) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, opinionId: null, opinionTitle: '' });

  const handleEdit = (id) => {
    router.push(`/opinions/${id}/edit`);
  };

  const handleView = (slug) => {
    // TODO: Open preview in new tab
    window.open(`${process.env.NEXT_PUBLIC_SITE_URL}/opini/${slug}`, '_blank');
  };

  const handleDeleteClick = (opinion) => {
    setDeleteDialog({
      isOpen: true,
      opinionId: opinion.id,
      opinionTitle: opinion.title,
    });
  };

  const handleDeleteConfirm = async () => {
    await onDelete(deleteDialog.opinionId);
    setDeleteDialog({ isOpen: false, opinionId: null, opinionTitle: '' });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Memuat data...</p>
      </div>
    );
  }

  if (!opinions || opinions.length === 0) {
    return (
      <EmptyState
        title="Belum ada opini"
        description="Mulai buat opini pertama Anda"
        actionLabel="Buat Opini"
        onAction={() => router.push('/opinions/create')}
      />
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opini
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Penulis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opinions.map((opinion) => (
              <tr key={opinion.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    {opinion.featured_image && (
                      <img
                        src={opinion.featured_image}
                        alt={opinion.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {opinion.title}
                      </h4>
                      {opinion.excerpt && (
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                          {opinion.excerpt}
                        </p>
                      )}
                      {opinion.tags && opinion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {opinion.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                          {opinion.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{opinion.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{opinion.author_name}</div>
                    {opinion.author_title && (
                      <div className="text-xs text-gray-500">{opinion.author_title}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={opinion.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <Eye className="w-4 h-4 inline mr-1" />
                  {opinion.views?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(opinion.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(opinion.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {opinion.status === 'draft' && (
                        <DropdownMenuItem onClick={() => onPublish(opinion.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {opinion.status === 'published' && (
                        <DropdownMenuItem onClick={() => handleView(opinion.slug)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(opinion)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteDialog({ isOpen: false, opinionId: null, opinionTitle: '' });
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Hapus Opini"
        description={`Apakah Anda yakin ingin menghapus opini "${deleteDialog.opinionTitle}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        variant="destructive"
      />
    </div>
  );
}
