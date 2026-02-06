'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { EventFlyerForm } from '@/components/event-flyers/EventFlyerForm'
import { eventFlyersApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function EditEventFlyerPage() {
  const router = useRouter()
  const params = useParams()
  const [flyer, setFlyer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchFlyer()
  }, [params.id])

  const fetchFlyer = async () => {
    try {
      const response = await eventFlyersApi.getById(params.id)
      setFlyer(response.data || response)
    } catch (error) {
      toast.error('Gagal memuat data event flyer')
      router.push('/event-flyers')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await eventFlyersApi.update(params.id, data)
      toast.success('Event flyer berhasil diupdate')
      router.push('/event-flyers')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate event flyer')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-neutral-500">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Edit Event Flyer</h1>
        <p className="text-neutral-500 mt-1">Update informasi event flyer</p>
      </div>

      {flyer && <EventFlyerForm flyer={flyer} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
