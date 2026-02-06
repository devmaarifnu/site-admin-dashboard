'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HeroSlideForm } from '@/components/hero-slides/HeroSlideForm'
import { heroSlidesApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function CreateHeroSlidePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await heroSlidesApi.create(data)
      toast.success('Hero slide berhasil ditambahkan')
      router.push('/hero-slides')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan hero slide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Tambah Hero Slide</h1>
        <p className="text-neutral-500 mt-1">Buat hero slide baru untuk homepage</p>
      </div>

      <HeroSlideForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
