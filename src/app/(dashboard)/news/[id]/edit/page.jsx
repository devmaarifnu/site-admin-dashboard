'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import NewsForm from '@/components/news/NewsForm';
import { newsApi } from '@/lib/api/news';

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        const response = await newsApi.getById(params.id);
        setNewsData(response.data);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError(err.response?.data?.message || 'Gagal memuat data berita');
        toast.error('Gagal memuat data berita');
        
        // Redirect back to news list after 2 seconds
        setTimeout(() => {
          router.push('/news');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNewsData();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Memuat data berita...</p>
          <p className="text-sm text-gray-600 mt-1">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Terjadi Kesalahan</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
          <p className="text-xs text-gray-500 mt-2">Mengalihkan ke halaman berita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary-600" />
            Edit Berita
          </h1>
          <p className="text-gray-600 mt-1">
            Perbarui informasi berita: {newsData?.title}
          </p>
        </div>
      </div>

      {/* Form */}
      <NewsForm mode="edit" initialData={newsData} />
    </div>
  );
}
