'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EventFlyerForm } from '@/components/event-flyers/EventFlyerForm'
import { eventFlyersApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function CreateEventFlyerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await eventFlyersApi.create(data)
      toast.success('Event flyer berhasil ditambahkan')
      router.push('/event-flyers')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan event flyer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Tambah Event Flyer</h1>
        <p className="text-neutral-500 mt-1">Upload poster atau flyer event baru</p>
      </div>

      <EventFlyerForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
