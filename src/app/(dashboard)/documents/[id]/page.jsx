'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function DocumentDetailPage() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // Redirect to edit page
    router.replace(`/documents/${params.id}/edit`)
  }, [params.id, router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Memuat...</p>
      </div>
    </div>
  )
}

