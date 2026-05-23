'use client';

import { X, Calendar, Tag, User, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

/**
 * ArticlePreviewModal
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - type: 'news' | 'opinion'
 *  - data: current form values
 *  - tags: full tag objects array (to resolve tag names from IDs)
 *  - categories: full category objects array (news only)
 */
export default function ArticlePreviewModal({ open, onClose, type, data, tags = [], categories = [] }) {
  if (!open) return null;

  const category = categories.find((c) => c.id === Number(data?.category_id));
  const selectedTagObjects = (data?.tag_ids || [])
    .map((id) => tags.find((t) => t.id === Number(id)))
    .filter(Boolean);

  const publishedAt = data?.published_at
    ? formatDate(new Date(data.published_at), 'dd MMM yyyy')
    : formatDate(new Date(), 'dd MMM yyyy');

  const statusLabel = {
    draft: 'Draft',
    published: 'Dipublikasikan',
    archived: 'Diarsipkan',
  }[data?.status] || 'Draft';

  const statusColor = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  }[data?.status] || 'bg-yellow-100 text-yellow-800';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50 shrink-0">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-gray-500" />
          <span className="font-semibold text-gray-800">
            Preview {type === 'news' ? 'Berita' : 'Opini'}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="ml-1">Tutup Preview</span>
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <article className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* Featured Image */}
            {data?.featured_image && (
              <div className="w-full aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={data.featured_image}
                  alt={data.title || ''}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            <div className="p-8 space-y-6">

              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2">
                {type === 'news' && category && (
                  <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-100">
                    {category.name}
                  </Badge>
                )}
                {type === 'news' && data?.is_featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">✦ Unggulan</Badge>
                )}
                {selectedTagObjects.map((tag) => (
                  <span key={tag.id} className="flex items-center gap-1 text-xs text-gray-500">
                    <Tag className="h-3 w-3" />
                    {tag.name}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {data?.title || <span className="text-gray-300 italic">Judul belum diisi...</span>}
              </h1>

              {/* Meta */}
              {type === 'news' && (
                <div className="flex items-center gap-4 text-sm text-gray-500 border-b pb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {publishedAt}
                  </span>
                </div>
              )}

              {/* Opinion Author */}
              {type === 'opinion' && (
                <div className="flex items-start gap-4 border-b pb-6">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {data?.author_image ? (
                      <img
                        src={data.author_image}
                        alt={data.author_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <User className="h-7 w-7 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {data?.author_name || <span className="text-gray-300 italic">Nama penulis...</span>}
                    </p>
                    {data?.author_title && (
                      <p className="text-sm text-gray-500">{data.author_title}</p>
                    )}
                    {data?.author_bio && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{data.author_bio}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {publishedAt}
                    </p>
                  </div>
                </div>
              )}

              {/* Excerpt */}
              {data?.excerpt && (
                <p className="text-lg text-gray-600 italic leading-relaxed border-l-4 border-primary-300 pl-4">
                  {data.excerpt}
                </p>
              )}

              {/* Content */}
              {data?.content ? (
                <div
                  className="prose prose-gray max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-lg prose-img:shadow-sm
                    prose-blockquote:border-primary-400 prose-blockquote:text-gray-600
                    prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
                    prose-ul:text-gray-700 prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              ) : (
                <div className="py-12 text-center text-gray-300 italic">
                  Konten belum diisi...
                </div>
              )}

            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
