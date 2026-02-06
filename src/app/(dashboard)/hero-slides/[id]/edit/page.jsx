'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { HeroSlideForm } from '@/components/hero-slides/HeroSlideForm'
import { heroSlidesApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function EditHeroSlidePage() {
  const router = useRouter()
  const params = useParams()
  const [slide, setSlide] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchSlide()
  }, [params.id])

  const fetchSlide = async () => {
    try {
      const response = await heroSlidesApi.getById(params.id)
      // API returns { success, message, data: {...} }
      setSlide(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching hero slide:', error)
      toast.error('Gagal memuat data hero slide')
      router.push('/hero-slides')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await heroSlidesApi.update(params.id, data)
      toast.success('Hero slide berhasil diupdate')
      router.push('/hero-slides')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate hero slide')
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
        <h1 className="text-3xl font-bold text-neutral-900">Edit Hero Slide</h1>
        <p className="text-neutral-500 mt-1">Update informasi hero slide</p>
      </div>

      {slide && <HeroSlideForm slide={slide} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
