'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { HeroSlideTable } from '@/components/hero-slides/HeroSlideTable'
import { Plus } from 'lucide-react'
import { heroSlidesApi } from '@/lib/api/modules'
import { toast } from 'sonner'

export default function HeroSlidesPage() {
  const router = useRouter()
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    setLoading(true)
    try {
      const response = await heroSlidesApi.getAll()
      // Response structure: { success, message, data: [...] }
      const slides = response.data?.data || response.data || []
      setSlides(Array.isArray(slides) ? slides : [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memuat hero slides')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Hero Slides</h1>
          <p className="text-neutral-500 mt-1">Kelola banner slider di homepage</p>
        </div>
        <Button onClick={() => router.push('/hero-slides/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Slide
        </Button>
      </div>

      {loading && !slides.length ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">Memuat data...</p>
        </div>
      ) : (
        <HeroSlideTable slides={slides} onUpdate={fetchSlides} />
      )}
    </div>
  )
}
