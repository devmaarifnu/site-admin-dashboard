'use client';

import { FileText } from 'lucide-react';
import NewsForm from '@/components/news/NewsForm';

export default function CreateNewsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary-600" />
            Buat Berita Baru
          </h1>
          <p className="text-gray-600 mt-1">
            Tambahkan berita baru ke website LP Ma'arif NU
          </p>
        </div>
      </div>

      {/* Form */}
      <NewsForm mode="create" />
    </div>
  );
}
