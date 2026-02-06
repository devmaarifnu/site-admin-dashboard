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
import Image from 'next/image'
import ImageUploader from '@/components/shared/ImageUploader'

const settingsSchema = z.object({
  site_name: z.string().min(3, 'Nama situs minimal 3 karakter'),
  site_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  meta_description: z.string().optional(),
  maintenance_mode: z.string().optional(),
  google_analytics_id: z.string().optional(),
  items_per_page: z.string().optional(),
  contact_email: z.string().email('Email tidak valid'),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),
  social_facebook: z.string().optional(),
  social_twitter: z.string().optional(),
  social_instagram: z.string().optional(),
  social_youtube: z.string().optional(),
})

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [logoUrl, setLogoUrl] = useState('')
  const [faviconUrl, setFaviconUrl] = useState('')
  const [settingsMap, setSettingsMap] = useState(new Map())

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(settingsSchema),
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsApi.getAll()
      
      // Response structure: { success, message, data: [...] }
      const settings = response.data?.data || response.data || []
      
      // Transform array to Map and object
      const map = new Map()
      const formData = {}
      
      settings.forEach(setting => {
        map.set(setting.setting_key, setting)
        formData[setting.setting_key] = setting.setting_value
      })
      
      setSettingsMap(map)
      
      // Set logo and favicon URLs
      setLogoUrl(formData.site_logo || '')
      setFaviconUrl(formData.site_favicon || '')
      
      // Reset form with data
      reset(formData)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Gagal memuat pengaturan')
    } finally {
      setFetching(false)
    }
  }

  // No need for manual upload handler - ImageUploader handles it

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Prepare settings object for update
      const payload = {
        ...data,
        site_logo: logoUrl || '',
        site_favicon: faviconUrl || '',
      }
      
      // Convert items_per_page to number if present
      if (payload.items_per_page) {
        payload.items_per_page = parseInt(payload.items_per_page, 10)
      }
      
      // Convert maintenance_mode to boolean
      if (payload.maintenance_mode !== undefined) {
        payload.maintenance_mode = payload.maintenance_mode === 'true'
      }
      
      await settingsApi.update(payload)
      toast.success('Pengaturan berhasil disimpan')
      fetchSettings() // Refresh data
    } catch (error) {
      console.error('Error saving settings:', error)
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
        <h1 className="text-3xl font-bold text-neutral-900">General Settings</h1>
        <p className="text-neutral-500 mt-1">Pengaturan umum website</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site_name">Site Name *</Label>
              <Input
                id="site_name"
                {...register('site_name')}
                placeholder="LP Ma'arif NU"
                className="mt-2"
              />
              {errors.site_name && (
                <p className="text-sm text-red-600 mt-1">{errors.site_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="site_description">Description</Label>
              <textarea
                id="site_description"
                {...register('site_description')}
                placeholder="Deskripsi website"
                className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo & Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Logo</Label>
              {logoUrl ? (
                <div className="mt-2 space-y-4">
                  <div className="relative w-48 h-48 border rounded-lg p-4 bg-white">
                    <Image src={logoUrl} alt="Logo" fill className="object-contain" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLogoUrl('')}
                  >
                    Ganti Logo
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  <ImageUploader
                    value={logoUrl}
                    onChange={setLogoUrl}
                    folder="logo"
                    label=""
                    description="Recommended size: 200x200px (Max 2MB)"
                    maxSize={2}
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Favicon</Label>
              {faviconUrl ? (
                <div className="mt-2 space-y-4">
                  <div className="relative w-24 h-24 border rounded-lg p-2 bg-white">
                    <Image src={faviconUrl} alt="Favicon" fill className="object-contain" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFaviconUrl('')}
                  >
                    Ganti Favicon
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  <ImageUploader
                    value={faviconUrl}
                    onChange={setFaviconUrl}
                    folder="logo"
                    label=""
                    description="Recommended size: 32x32px or 64x64px (Max 1MB)"
                    maxSize={1}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                {...register('meta_keywords')}
                placeholder="lp ma'arif nu, pendidikan islam, nahdlatul ulama"
                className="mt-2"
              />
              <p className="text-xs text-neutral-500 mt-1">Pisahkan dengan koma</p>
            </div>

            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <textarea
                id="meta_description"
                {...register('meta_description')}
                placeholder="Deskripsi untuk mesin pencari (SEO)"
                className="mt-2 w-full min-h-[80px] px-3 py-2 border rounded-md"
                maxLength={160}
              />
              <p className="text-xs text-neutral-500 mt-1">Maksimal 160 karakter</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
              <Input
                id="google_analytics_id"
                {...register('google_analytics_id')}
                placeholder="UA-XXXXXXXXX-X atau G-XXXXXXXXXX"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="items_per_page">Items Per Page</Label>
              <Input
                id="items_per_page"
                type="number"
                {...register('items_per_page')}
                placeholder="10"
                className="mt-2"
                min="1"
                max="100"
              />
              <p className="text-xs text-neutral-500 mt-1">Jumlah item per halaman untuk tabel/list</p>
            </div>

            <div>
              <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
              <select
                id="maintenance_mode"
                {...register('maintenance_mode')}
                className="mt-2 w-full px-3 py-2 border rounded-md"
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
              <p className="text-xs text-neutral-500 mt-1">Aktifkan untuk menutup sementara website</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact_email">Email *</Label>
              <Input
                id="contact_email"
                type="email"
                {...register('contact_email')}
                placeholder="info@lpmaarifnu.or.id"
                className="mt-2"
              />
              {errors.contact_email && (
                <p className="text-sm text-red-600 mt-1">{errors.contact_email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                {...register('contact_phone')}
                placeholder="+62 21 1234567"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="contact_address">Address</Label>
              <textarea
                id="contact_address"
                {...register('contact_address')}
                placeholder="Alamat lengkap"
                className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="social_facebook">Facebook URL</Label>
              <Input
                id="social_facebook"
                {...register('social_facebook')}
                placeholder="https://facebook.com/lpmaarifnu"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="social_twitter">Twitter/X URL</Label>
              <Input
                id="social_twitter"
                {...register('social_twitter')}
                placeholder="https://twitter.com/lpmaarifnu"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="social_instagram">Instagram URL</Label>
              <Input
                id="social_instagram"
                {...register('social_instagram')}
                placeholder="https://instagram.com/lpmaarifnu"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="social_youtube">YouTube URL</Label>
              <Input
                id="social_youtube"
                {...register('social_youtube')}
                placeholder="https://youtube.com/@lpmaarifnu"
                className="mt-2"
              />
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
