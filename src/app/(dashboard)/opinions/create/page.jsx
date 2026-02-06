'use client';

import { MessageSquare } from 'lucide-react';
import OpinionForm from '@/components/opinions/OpinionForm';

export default function CreateOpinionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-primary-600" />
            Buat Opini Baru
          </h1>
          <p className="text-gray-600 mt-1">
            Tambahkan artikel opini baru ke website LP Ma'arif NU
          </p>
        </div>
      </div>

      {/* Form */}
      <OpinionForm mode="create" />
    </div>
  );
}
