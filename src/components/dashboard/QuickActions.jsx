'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PlusCircle, Upload, Mail, Image } from 'lucide-react';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: 'Buat Berita',
      description: 'Tulis artikel berita baru',
      icon: PlusCircle,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      onClick: () => router.push('/news/create'),
    },
    {
      label: 'Buat Opini',
      description: 'Tulis artikel opini baru',
      icon: PlusCircle,
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
      onClick: () => router.push('/opinions/create'),
    },
    {
      label: 'Upload Dokumen',
      description: 'Upload dokumen baru',
      icon: Upload,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      onClick: () => router.push('/documents/upload'),
    },
    {
      label: 'Pesan Kontak',
      description: 'Lihat pesan dari pengunjung',
      icon: Mail,
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      onClick: () => router.push('/contact-messages'),
    },
    {
      label: 'Upload Event',
      description: 'Upload flyer event baru',
      icon: Image,
      color: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
      onClick: () => router.push('/event-flyers/create'),
    },
    {
      label: 'Media Library',
      description: 'Kelola media file',
      icon: Image,
      color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
      onClick: () => router.push('/media-library'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Aksi cepat untuk tugas umum</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className={`p-3 rounded-lg mb-2 ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">
                {action.label}
              </span>
              <span className="text-xs text-gray-500 text-center mt-1">
                {action.description}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
