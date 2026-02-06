'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { settingsApi } from '@/lib/api/modules'
import { toast } from 'sonner'

const seoSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  google_analytics_id: z.string().optional(),
  google_site_verification: z.string().optional(),
})

export default function SEOSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(seoSchema),
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsApi.getSEO()
      reset(response.data || response)
    } catch (error) {
      toast.error('Gagal memuat pengaturan SEO')
    } finally {
      setFetching(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await settingsApi.updateSEO(data)
      toast.success('Pengaturan SEO berhasil disimpan')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan pengaturan')
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
        <h1 className="text-3xl font-bold text-neutral-900">SEO Settings</h1>
        <p className="text-neutral-500 mt-1">Pengaturan SEO dan meta tags</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Meta Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                {...register('meta_title')}
                placeholder="LP Ma'arif NU - Lembaga Pendidikan"
                className="mt-2"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Judul yang akan muncul di hasil pencarian (recommended: 50-60 karakter)
              </p>
            </div>

            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <textarea
                id="meta_description"
                {...register('meta_description')}
                placeholder="Deskripsi singkat website untuk search engine"
                className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
                maxLength={160}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Deskripsi yang akan muncul di hasil pencarian (recommended: 150-160 karakter)
              </p>
            </div>

            <div>
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                {...register('meta_keywords')}
                placeholder="pendidikan, ma'arif, nu, islam"
                className="mt-2"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Kata kunci dipisahkan dengan koma
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics & Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
              <Input
                id="google_analytics_id"
                {...register('google_analytics_id')}
                placeholder="G-XXXXXXXXXX atau UA-XXXXXXXXX-X"
                className="mt-2"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Google Analytics Measurement ID
              </p>
            </div>

            <div>
              <Label htmlFor="google_site_verification">Google Site Verification Code</Label>
              <Input
                id="google_site_verification"
                {...register('google_site_verification')}
                placeholder="google-site-verification code"
                className="mt-2"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Kode verifikasi dari Google Search Console
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
